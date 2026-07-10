FROM python:3.13-slim

WORKDIR /app

COPY requirements.txt .

RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt

RUN python -c "import nltk; nltk.download('punkt'); nltk.download('punkt_tab')"

COPY download_model.py .

RUN python download_model.py

COPY . .

EXPOSE 8000

CMD ["python", "main.py"]