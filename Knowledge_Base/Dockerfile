FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y build-essential gcc && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

# Maintenant sentence-transformers existe
COPY download_model.py .

RUN python download_model.py

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]