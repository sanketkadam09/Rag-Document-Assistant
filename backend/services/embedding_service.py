import os
from google import genai
from dotenv import load_dotenv
from services.cache_service import redis_client
import json

load_dotenv()

client = None

def get_client():
    global client
    if client is None:
        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    return client

def create_embedding(text):
    cache_key = f"embedding:{text}"

    #  CHECK CACHE
    cached = redis_client.get(cache_key)
    if cached:
        return json.loads(cached)

    #  Not cached → call API
    client = get_client()
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text
    )

    embedding = response.embeddings[0].values

    #  STORE IN CACHE
    redis_client.set(cache_key, json.dumps(embedding), ex=3600)

    return embedding