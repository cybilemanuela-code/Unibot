import firebase_admin
from firebase_admin import credentials, firestore
import os
from dotenv import load_dotenv

load_dotenv()

def init_firebase():
    # Évite double initialisation
    if not firebase_admin._apps:
        json_path = os.getenv("FIREBASE_SERVICE_ACCOUNT", "serviceAccountKey.json")

        if not os.path.exists(json_path):
            raise FileNotFoundError(
                f"Fichier Firebase introuvable: {json_path}"
            )

        cred = credentials.Certificate(json_path)
        firebase_admin.initialize_app(cred)

        print("✅ Firebase initialisé avec succès.")

    return firestore.client()

# Instance Firestore globale réutilisable
db_firestore = init_firebase()