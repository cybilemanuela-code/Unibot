import os
import numpy as np
import chromadb
import re
import shutil
import uuid
from fastapi import FastAPI
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware
from sentence_transformers import SentenceTransformer
from fastapi import UploadFile, File
import httpx

# Imports Firebase
import firebase_admin
from firebase_admin import credentials, firestore
from google.cloud.firestore_v1.base_query import FieldFilter

# Imports IA
from llama_index.llms.groq import Groq
from llama_index.core import Settings

load_dotenv()

# =========================
# 1. CONFIGURATION DES IA
# =========================
print(" Chargement du modèle d'IA locale (Embeddings)...")
embed_model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

print(" Connexion à Groq Cloud...")
GROQ_KEY = os.getenv("GROQ_API_KEY")
llm_groq = Groq(model="llama-3.3-70b-versatile", api_key=GROQ_KEY)
Settings.llm = llm_groq

# =========================
# 2. INITIALISATIONS
# =========================
app = FastAPI(title="Unibot Engine - PRO Version")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

if not firebase_admin._apps:
    cred = credentials.Certificate(os.getenv("FIREBASE_SERVICE_ACCOUNT"))
    firebase_admin.initialize_app(cred)
db = firestore.client()

chroma_client = chromadb.PersistentClient(path="./chroma_db")
collection = chroma_client.get_or_create_collection("university_docs")

# =========================
# 3. OUTILS LOGIQUES
# =========================

def clean_output(text):

    # Numéros toujours sur une nouvelle ligne
    text = re.sub(
        r'(?<!\n)(\d+\.)',
        r'\n\n\1',
        text
    )

    # Tirets toujours sur une nouvelle ligne
    text = re.sub(
        r'(?<!\n)- ',
        r'\n- ',
        text
    )

    # Supprime les espaces multiples
    text = re.sub(
        r'\n{3,}',
        '\n\n',
        text
    )

    return text.strip()

def cosine_similarity(v1, v2):
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def search_faq(query_vector, lang):
    """Recherche dans la collection faq_index avant le RAG"""
    best_score = 0
    best_answer = None
    
    # On récupère les FAQs de la langue choisie
    docs = db.collection("faq_index").where(filter=FieldFilter("language", "==", lang)).get()
    
    for d in docs:
        data = d.to_dict()
        if "embedding" in data:
            score = cosine_similarity(query_vector, data["embedding"])
            if score > best_score:
                best_score = score
                best_answer = data["answer"]
    return best_answer, best_score

# =========================
# 4. ENDPOINT CHAT
# =========================

class ChatRequest(BaseModel):
    user_id: str
    question: str
    language: str | None = "fr"

@app.post("/chat")
def chat(req: ChatRequest):
    try:
        lang = req.language if req.language in ["fr", "en"] else "fr"
        print(f"\n[CHAT] Nouvelle Question: {req.question}")

        # --- ÉTAPE 1 : VECTEUR LOCAL ---
        query_vector = embed_model.encode(req.question).tolist()

        # --- ÉTAPE 2 : RECHERCHE FAQ (PRIORITÉ) ---
        faq_answer, faq_score = search_faq(query_vector, lang)
        
        if faq_answer and faq_score >= 0.85:
            print(f"[FAQ] Match trouvé ! Score: {round(faq_score, 3)}")
            final_answer = faq_answer
            source = "FAQ"
        else:
            # --- ÉTAPE 3 : RECHERCHE RAG (DOCUMENTS) ---
            print(f"[RAG] Score FAQ faible ({round(faq_score, 2)}). Recherche documents...")
            
            results = collection.query(
                query_embeddings=[query_vector],
                n_results=4, # On augmente à 4 pour plus de précision
                where={"lang": lang}
            )

            context = ""
            rag_score = 0.0
            if results.get("documents") and results["documents"][0]:
                context = "\n".join(results["documents"][0])
                if results.get("distances") and results["distances"][0]:
                    best_dist = min(results["distances"][0])
                    rag_score = round(1.0 / (1.0 + best_dist), 3)

            # --- ÉTAPE 4 : PROMPT SYSTÈME STRICT (Évite les hallucinations et gère le ton) ---
            instruction = "Réponds en Français" if lang == "fr" else "Answer in English"
            
            system_prompt = f"""Tu es l'Assistant Officiel de l'IUC . 
            
            RÈGLES CRUCIALES :
            1. Sois PRÉCIS et AFFIRMATIF. Ne dis pas "Cependant" ou "Selon le contexte" si l'info est claire.
            2. Si la question est une salutation (Bonjour, Hello, Who are you), réponds poliment que tu es l'assistant de l'IUC.
            3. Pour les listes (documents, conditions), utilise des tirets (-) et des sauts de ligne pour que ce soit TRÈS lisible.
            4. INTERDICTION d'utiliser des symboles Markdown : pas d'étoiles (*), pas de double étoiles (**), pas de dièses (#).
            5. Lorsque tu présentes des étapes ou une procédure,chaque étape doit commencer sur une nouvelle ligne.
            6. Laisse une ligne vide entre deux étapes.
            7. Lorsque tu listes des documents ou conditions,utilise le même format aéré.
            8. Ne commence jamais par "Selon les documents". Donne la réponse directement.
            9. {instruction}.
            
            CONTEXTE OFFICIEL :
            {context}
            
            QUESTION UTILISATEUR : {req.question}
            RÉPONSE :"""

            response = llm_groq.complete(system_prompt)
            final_answer = response.text
            final_answer = clean_output(final_answer)
            source = "RAG"

        # --- ÉTAPE 5 : SAUVEGARDE ET ENVOI ---
        final_score = float(faq_score) if source == "FAQ" else float(rag_score)
        db.collection("chat_history").document(req.user_id).collection("messages").add({
            "question": req.question,
            "answer": final_answer,
            "source": source,
            "score": final_score,
            "timestamp": firestore.SERVER_TIMESTAMP,
            "lang": lang
        })

        # --- ÉTAPE 6 : NOTIFICATION ADMIN SI QUESTION NON RÉSOLUE ---
        answer_lower = final_answer.lower()
        is_unresolved = (
            final_score < 0.6
            or "pas trouve" in answer_lower
            or "sorry" in answer_lower
            or "erreur technique" in answer_lower
            or "Desole je ne sais pas" in answer_lower
            or "not found" in answer_lower
            or "i don't know" in answer_lower
            or "did not find" in answer_lower
            or "introuvable" in answer_lower
        )
        if is_unresolved:
            try:
                db.collection("notifications").add({
                    "target": "admin",
                    "title": "Question non resolue",
                    "message": f"Question : '{req.question[:50]}...' | Score: {round(final_score, 2)} | Source: {source}",
                    "type": "warning",
                    "isRead": False,
                    "timestamp": firestore.SERVER_TIMESTAMP
                })
                print(f"[NOTIF] Notification admin créée pour : {req.question[:30]}")
            except Exception as notif_err:
                print(f"Erreur création notification: {notif_err}")

        return {"answer": final_answer, "source": source, "score": round(final_score, 2)}

    except Exception as e:
        print(f"[ERREUR] {e}")
        return {"error": str(e), "answer": "Désolé, je rencontre une erreur technique."}
    

async def transcribe_with_groq(file_path: str) -> str:
    url = "https://api.groq.com/openai/v1/audio/transcriptions"
    headers = {"Authorization": f"Bearer {GROQ_KEY}"}

    with open(file_path, "rb") as f:
        files = {"file": ("audio.webm", f, "audio/webm")}
        data = {"model": "whisper-large-v3-turbo"}

        async with httpx.AsyncClient(timeout=120.0) as client:
            resp = await client.post(url, headers=headers, files=files, data=data)
            resp.raise_for_status()
            return resp.json()["text"]


@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    try:
        temp_id = str(uuid.uuid4())
        file_path = f"{os.path.join(os.getcwd(), 'tmp', temp_id)}.webm"
        os.makedirs(os.path.dirname(file_path), exist_ok=True)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Transcrire avec Groq Whisper API
        text = await transcribe_with_groq(file_path)

        # Nettoyer le fichier temporaire
        try:
            os.remove(file_path)
        except:
            pass

        return {"text": text}

    except Exception as e:
        print("[ERREUR] Transcription error:", e)
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    # Port 8000 pour le chat (L'admin tournera sur 8001)
    uvicorn.run(app, host="0.0.0.0", port=8000)