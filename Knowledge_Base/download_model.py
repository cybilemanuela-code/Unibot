from sentence_transformers import SentenceTransformer

print("Téléchargement du modèle...")
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

print("Sauvegarde du modèle...")
model.save("./models/all-MiniLM-L6-v2")

print("Terminé !")