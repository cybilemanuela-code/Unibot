FROM python:3.11-slim

WORKDIR /app

# Installer les dépendances système
RUN apt-get update && apt-get install -y \
    build-essential \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copier les dépendances
COPY requirements.txt .

# Mettre pip à jour
RUN pip install --upgrade pip

# Installer les dépendances Python
RUN pip install --no-cache-dir -r requirements.txt

# Copier le projet
COPY . .
RUN python download_model.py

# Exposer le port (optionnel, mais recommandé)
EXPOSE 8000

# Lancer l'application
CMD ["python", "main.py"]