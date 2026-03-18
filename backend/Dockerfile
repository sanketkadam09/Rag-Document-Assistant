FROM python:3.10

WORKDIR /app

RUN apt-get update && apt-get install -y tesseract-ocr
COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 5000

CMD ["python","app.py"]