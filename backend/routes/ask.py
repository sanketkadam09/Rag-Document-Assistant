from flask import Blueprint, request
from services.embedding_service import create_embedding
from services.retrieval_service import retrieve_similar_pages
from services.qa_services import generate_answer

ask_bp=Blueprint("ask",__name__)

@ask_bp.route("/ask",methods=["POST"])
def ask_question():
    data=request.json
    question= data.get("question")
    query_embedding =create_embedding(question)

    pages=retrieve_similar_pages(query_embedding)

    context=""

    sources=[]

    for doc,page,content in pages:
        context +=f"\n{content}\n"
        sources.append(f"{doc}page {page}")
    answer= generate_answer(context,question)

    return {
        "answer":answer,
        "sources":sources
    }    