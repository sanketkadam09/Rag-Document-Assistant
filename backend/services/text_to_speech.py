from gtts import gTTS
import os
import uuid

OUTPUT_FOLDER = "audio/output_audio"

# create folder if not exists
# os.makedirs(OUTPUT_FOLDER, exist_ok=True)


def convert_text_to_speech(text):
    """
    Convert Gemini answer text into voice (mp3)
    Returns audio file path
    """

    try:
        filename = f"{uuid.uuid4()}.mp3"
        file_path = os.path.join(OUTPUT_FOLDER, filename)

        tts = gTTS(text=text, lang="en", slow=False)
        tts.save(file_path)

        return file_path, filename, None

    except Exception as e:
        print("TTS Error:", str(e))
        return None, None, str(e)