import os
import numpy as np
from dotenv import load_dotenv
from google import genai
from firebase_config import db_firestore

# Imports LlamaIndex pour le RAG
from llama_index.core import Settings, VectorStoreIndex, StorageContext
from llama_index.vector_stores.chroma import ChromaVectorStore
import chromadb
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

load_dotenv()
api_key = os.getenv("GROQ_API_KEY")
client = genai.Client(api_key=api_key)

# Configuration LlamaIndex (Identique à ingest.py)
Settings.llm = GoogleGenAI(model="gemini-2.5-flash", api_key=api_key)
Settings.embed_model = GoogleGenAIEmbedding(model_name="gemini-embedding-2", api_key=api_key)

def cosine_similarity(v1, v2):
    """Calcule la ressemblance entre deux vecteurs"""
    return np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2))

def search_faq(user_query_vector):
    """Recherche la question la plus proche dans Firestore"""
    best_score = 0
    best_answer = None

    # On récupère toutes les FAQs de Firestore
    faqs = db_firestore.collection("faq_collection").stream()
    
    for faq in faqs:
        data = faq.to_dict()
        score = cosine_similarity(user_query_vector, data['embedding'])
        if score > best_score:
            best_score = score
            best_answer = data['answer']
            
    return best_answer, best_score

def get_hybrid_response(user_question):
    # ÉTAPE 1 : Transformer la question de l'utilisateur en vecteur
    res = client.models.embed_content(model="text-embedding-004", contents=user_question)
    user_vector = res.embeddings[0].values

    # ÉTAPE 2 : Chercher dans la FAQ (Firestore)
    print("Recherche dans la FAQ...")
    faq_answer, faq_score = search_faq(user_vector)

    # Si le score est très élevé (> 0.85), on donne la réponse FAQ immédiatement
    if faq_score > 0.85:
        return faq_answer, "FAQ"

    # ÉTAPE 3 : Si score faible, on passe au RAG (ChromaDB)
    print(f"FAQ score faible ({faq_score:.2f}). Passage au RAG...")
    
    if not os.path.exists("./chroma_db"):
        return "Désolé, je ne trouve pas la base de documents.", "ERROR"

    db = chromadb.PersistentClient(path="./chroma_db")
    chroma_collection = db.get_collection("university_docs")
    vector_store = ChromaVectorStore(chroma_collection=chroma_collection)
    index = VectorStoreIndex.from_vector_store(vector_store)
    
    query_engine = index.as_query_engine(similarity_top_k=3)
    response = query_engine.query(user_question)

    return str(response), "RAG"