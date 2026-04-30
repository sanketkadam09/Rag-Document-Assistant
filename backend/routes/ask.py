from flask import Blueprint, request, send_from_directory, jsonify
from services.embedding_service import create_embedding
from services.retrieval_service import retrieve_similar_pages
from services.qa_services import generate_answer
from services.text_to_speech import convert_text_to_speech
from services.cache_service import redis_client

import json

ask_bp = Blueprint("ask", __name__)

@ask_bp.route("/ask", methods=["POST"])
def ask_question():
    data = request.json
    question = data.get("question")
    is_voice = data.get("is_voice", False)

    if not question:
        return jsonify({
            "answer": "No question provided",
            "sources": []
        }), 400

    cache_key = f"qa:{question}"
    cached = redis_client.get(cache_key)

    if cached:
        print("cache hit")
        return json.loads(cached)

    print("cache miss")

    query_embedding = create_embedding(question)
    pages = retrieve_similar_pages(query_embedding)

    context = ""
    sources = []

    for doc, page, content in pages:
        context += f"\n{content}\n"
        sources.append(f"{doc} page {page}")

    answer = generate_answer(context, question)

    response_data = {
        "answer": answer,
        "sources": sources
    }

    # Voice response only for mic input
    
    audio_path, filename, error = convert_text_to_speech(answer)

    if not error:
            response_data["audio_url"] = f"http://localhost:5000/audio/{filename}"

    # Cache for both text + voice
    redis_client.set(
        cache_key,
        json.dumps(response_data),
        ex=300
    )

    return jsonify(response_data)


@ask_bp.route("/audio/<filename>", methods=["GET"])
def serve_audio(filename):
    return send_from_directory(
        "audio/output_audio",
        filename
    )