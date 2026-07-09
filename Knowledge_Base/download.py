from sentence_transformers import SentenceTransformer
import os

print("⏳ Tentative de téléchargement du modèle local...")
try:
    # On force le téléchargement
    model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
    print("✅ Modèle téléchargé et prêt à l'emploi !")
except Exception as e:
    print(f"❌ Erreur de connexion : {e}")
    print("Vérifiez votre connexion internet ou désactivez votre VPN/Antivirus temporairement.")