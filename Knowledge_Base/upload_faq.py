import json
import os
import time
from dotenv import load_dotenv
from firebase_config import db_firestore
from sentence_transformers import SentenceTransformer

# Modèle local identique au main.py
print("🚀 Chargement du modèle d'embedding local...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

def upload_faq():
    json_file = 'iuc_chatbot_dataset.json'
    with open(json_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    print("🚀 Indexation locale vers Firestore (faq_index)...")
    
    count = 0
    for category, questions in data['dataset'].items():
        for item in questions:
            try:
                # Génération locale instantanée
                embedding = model.encode(item['question']).tolist()

                db_firestore.collection("faq_index").add({
                    "id": item.get("id"),
                    "question": item["question"],
                    "answer": item["answer"],
                    "language": item["language"],
                    "category": category,
                    "embedding": embedding,
                    "timestamp": time.time()
                })
                count += 1
                if count % 10 == 0: print(f"✅ {count} questions indexées...")
            except Exception as e:
                print(f"❌ Erreur : {e}")

    print(f"\n🎉 Terminé ! {count} FAQs prêtes.")

if __name__ == "__main__":
    upload_faq()