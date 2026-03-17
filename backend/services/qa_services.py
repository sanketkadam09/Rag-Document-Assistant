import os
from google import genai
from dotenv import load_dotenv
import time

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_answer(context, question):
    prompt = f"""
You are an AI assistant answering questions based only on provided documents.

Context:
{context}

Question:
{question}

Provide a clear answer and reference the source pages.
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )
        return response.text

    except Exception as e:
        print("Gemini Error:", e)

        
        return " AI service unavailable (quota exceeded). Showing fallback answer."