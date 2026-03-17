from flask import Flask
from flask_cors import CORS

from routes.health import health_bp
from routes.ask import ask_bp
from routes.upload import upload_bp
from routes.documents import doc_bp


app=Flask(__name__)
app.register_blueprint(health_bp)
app.register_blueprint(upload_bp)
app.register_blueprint(ask_bp)
app.register_blueprint(doc_bp)

CORS(app)

@app.route("/")
def home():
    return {"message":"Rag assistant Running"}

if __name__=="__main__":
    app.run(host="0.0.0.0",port=5000, debug=True)