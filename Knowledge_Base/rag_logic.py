import os
import re
import logging
from dotenv import load_dotenv

import chromadb
from llama_index.core import Settings, VectorStoreIndex
from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.llms.google_genai import GoogleGenAI
from llama_index.embeddings.google_genai import GoogleGenAIEmbedding

# =========================
# LOGGING
# =========================
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("RAG")

# =========================
# ENV
# =========================
load_dotenv()
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise ValueError("Missing GROQ_API_KEY in .env")

# =========================
# MODELS
# =========================
Settings.llm = GoogleGenAI(
    model="gemini-2.5-flash",
    api_key=api_key
)

Settings.embed_model = GoogleGenAIEmbedding(
    model_name="gemini-embedding-2",
    api_key=api_key
)

# =========================
# TEXT NORMALIZATION
# =========================
def normalize_query(query: str) -> str:
    """Standardise la question pour améliorer la cohérence"""
    query = query.lower().strip()
    query = re.sub(r"[^\w\s]", "", query)  # remove punctuation
    query = re.sub(r"\s+", " ", query)     # normalize spaces
    return query

# =========================
# LOAD VECTOR DB
# =========================
def load_vector_store():
    if not os.path.exists("./chroma_db"):
        raise FileNotFoundError("chroma_db not found. Run ingest.py first.")

    client = chromadb.PersistentClient(path="./chroma_db")
    collection = client.get_collection("university_docs")

    return ChromaVectorStore(chroma_collection=collection)

# =========================
# BUILD INDEX
# =========================
def build_index():
    vector_store = load_vector_store()
    return VectorStoreIndex.from_vector_store(vector_store)

# =========================
# QUERY ENGINE
# =========================
def get_query_engine():
    try:
        index = build_index()

        query_engine = index.as_query_engine(
            similarity_top_k=5,  # 🔥 important pour stabilité
        )

        logger.info("Query engine ready")
        return query_engine

    except Exception as e:
        logger.error(f"Failed to init query engine: {e}")
        return None


query_engine = get_query_engine()

# =========================
# MAIN RAG FUNCTION
# =========================
def get_answer(question: str) -> str:
    if query_engine is None:
        return "System error: knowledge base not available."

    try:
        # 1. normalize question
        clean_question = normalize_query(question)

        logger.info(f"Question: {clean_question}")

        # 2. retrieve
        response = query_engine.query(clean_question)

        context_answer = str(response).strip()

        # 3. stability checks
        if not context_answer:
            return "I could not find relevant information in the knowledge base."

        if "does not contain" in context_answer.lower():
            return (
                "I could not find relevant information in the university documents. "
                "Please rephrase your question."
            )

        # 4. force consistent style (VERY IMPORTANT)
        final_prompt = f"""
You are a strict university assistant.

Rules:
- Use ONLY the provided context
- Do NOT invent information
- Give a clear and consistent answer
- If information is missing, say "Not found in documents"

Context:
{context_answer}

Question:
{question}

Final Answer:
"""

        final_response = Settings.llm.complete(final_prompt)

        return final_response.text.strip()

    except Exception as e:
        logger.error(f"Query error: {e}")
        return "An error occurred while processing your request."

# =========================
# DEBUG MODE
# =========================
def debug_query(question: str):
    if query_engine is None:
        return None

    clean = normalize_query(question)
    response = query_engine.query(clean)

    print("\n===== RAW RETRIEVAL =====\n")
    print(response)

    return response