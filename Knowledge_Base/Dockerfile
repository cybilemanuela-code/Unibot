FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip

RUN pip install --no-cache-dir -r requirements.txt

# Vérification (temporaire)
RUN python -c "from sentence_transformers import SentenceTransformer; print('sentence-transformers OK')"

COPY download_model.py .

RUN python download_model.py

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]