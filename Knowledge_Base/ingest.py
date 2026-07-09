import os
import shutil
import chromadb

from llama_index.core import (
    Settings,
    VectorStoreIndex,
    SimpleDirectoryReader,
    StorageContext,
)

from llama_index.vector_stores.chroma import ChromaVectorStore
from llama_index.embeddings.huggingface import HuggingFaceEmbedding

# ==================================================
# CONFIGURATION EMBEDDINGS LOCAUX
# ==================================================

Settings.embed_model = HuggingFaceEmbedding(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)

# Pas besoin de LLM pendant l'indexation
Settings.llm = None


# ==================================================
# INGESTION BILINGUE
# ==================================================

def ingest_bilingual():

    print("🚀 Début de l'indexation...")

    # Supprimer l'ancienne base
    if os.path.exists("./chroma_db"):
        shutil.rmtree("./chroma_db")
        print("🧹 Ancienne base supprimée.")

    # Création ChromaDB
    client = chromadb.PersistentClient(path="./chroma_db")

    collection = client.get_or_create_collection(
        name="university_docs"
    )

    vector_store = ChromaVectorStore(
        chroma_collection=collection
    )

    storage_context = StorageContext.from_defaults(
        vector_store=vector_store
    )

    all_docs = []

    # ==================================================
    # DOCUMENTS FRANÇAIS
    # ==================================================
    fr_path = "./data/fr"

    if os.path.exists(fr_path):

        print("📖 Chargement des documents FR...")

        docs_fr = SimpleDirectoryReader(fr_path).load_data()

        for doc in docs_fr:
            doc.metadata["lang"] = "fr"

        all_docs.extend(docs_fr)

        print(f"✅ {len(docs_fr)} page(s) FR chargé(s)")

    else:
        print("⚠️ Dossier ./data/fr introuvable")

    # ==================================================
    # DOCUMENTS ANGLAIS
    # ==================================================
    en_path = "./data/en"

    if os.path.exists(en_path):

        print("📖 Chargement des documents EN...")

        docs_en = SimpleDirectoryReader(en_path).load_data()

        for doc in docs_en:
            doc.metadata["lang"] = "en"

        all_docs.extend(docs_en)

        print(f"✅ {len(docs_en)} page(s) EN chargé(s)")

    else:
        print("⚠️ Dossier ./data/en introuvable")

    # ==================================================
    # VÉRIFICATION
    # ==================================================
    if len(all_docs) == 0:
        print("❌ Aucune page trouvée.")
        return

    print(f"📚 Total pages : {len(all_docs)}")

    # ==================================================
    # INDEXATION
    # ==================================================
    print("🧠 Génération des embeddings locaux...")

    VectorStoreIndex.from_documents(
        all_docs,
        storage_context=storage_context,
        show_progress=True
    )

    print("\n🎉 Indexation terminée avec succès !")
    print("📁 Base créée dans : ./chroma_db")
    print("🤖 Unibot est prêt pour le mode RAG.")


# ==================================================
# MAIN
# ==================================================

if __name__ == "__main__":
    ingest_bilingual()