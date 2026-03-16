import os
from google import genai
from dotenv import load_dotenv

load_dotenv()

client =genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def generate_answer(context,question):
    prompt = f""" 
        You are an ai assistant answering question based only on provided docuemnts.

        Context:
        {context}
        Question:
        {question}

        Provide a clear answer and reference the souce pages.
         """
    response=client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
        

    )

    return response.text