from flask import Blueprint, request, jsonify
import os
from services.speech_to_text import convert_speech_to_text

voice_bp = Blueprint("voice", __name__)

UPLOAD_FOLDER = "audio/input_audio"

# create folder if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)


@voice_bp.route("/voice", methods=["POST"])
def handle_voice():
    """
    Receive audio file from frontend
    Convert speech -> text using Whisper
    Return extracted text
    """

    try:
        if "audio" not in request.files:
            return jsonify({
                "success": False,
                "message": "No audio file received"
            }), 400

        audio_file = request.files["audio"]

        if audio_file.filename == "":
            return jsonify({
                "success": False,
                "message": "Empty file name"
            }), 400

        file_path = os.path.join(
            UPLOAD_FOLDER,
            audio_file.filename
        )
        
        audio_file.save(file_path)
        print("saved file:",file_path)
        print("file size:",os.path.getsize(file_path))

        extracted_text, error = convert_speech_to_text(file_path)

        if error:
            return jsonify({
                "success": False,
                "message": error
            }), 500

        return jsonify({
            "success": True,
            "text": extracted_text
        })

    except Exception as e:
        print("Voice Route Error:", str(e))

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500