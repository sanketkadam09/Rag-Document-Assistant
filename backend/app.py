from flask import Flask
from flask_cors import CORS
import os
# from routes.voice import voice_bp
from routes.health import health_bp
from routes.ask import ask_bp
from routes.upload import upload_bp
from routes.documents import doc_bp
from models import db
from flask_migrate import Migrate

app = Flask(__name__)
BASE_AUDIO = "audio"
INPUT_AUDIO = os.path.join(BASE_AUDIO, "input_audio")
OUTPUT_AUDIO = os.path.join(BASE_AUDIO, "output_audio")

os.makedirs("audio/input_audio", exist_ok=True)
os.makedirs("audio/output_audio", exist_ok=True)

#  DB Config
app.config["SQLALCHEMY_DATABASE_URI"] = (
    f"postgresql://{os.getenv('DB_USER')}:{os.getenv('DB_PASSWORD')}"
    f"@{os.getenv('DB_HOST')}:{os.getenv('DB_PORT')}/{os.getenv('DB_NAME')}"
)
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

#  Initialize DB
db.init_app(app)

#  Initialize Migrate (THIS WAS MISSING 🔥)
migrate = Migrate(app, db)

#  Register Blueprints
app.register_blueprint(health_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(ask_bp)
app.register_blueprint(doc_bp)
# app.register_blueprint(voice_bp)

#  CORS
CORS(app, resources={r"/*": {"origins": "*"}})

@app.route("/")
def home():
    return {"message": "Rag assistant Running"}

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)