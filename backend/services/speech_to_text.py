import whisper
import os

# Load Whisper model only once when server starts
model = whisper.load_model("base")


def convert_speech_to_text(audio_path):
    """
    Convert uploaded audio file into text using Whisper
    """

    try:
        if not os.path.exists(audio_path):
            return None, "Audio file not found"

        result = model.transcribe(audio_path)

        extracted_text = result["text"].strip()

        if not extracted_text:
            return None, "No speech detected"

        return extracted_text, None

    except Exception as e:
        print("Whisper Error:", str(e))
        return None, str(e)