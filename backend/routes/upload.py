from flask import Blueprint, request
import os
from services.document_parser import extract_text_from_pdf, extract_text_from_image
from services.index_service import index_document


upload_bp = Blueprint("upload", __name__)

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

@upload_bp.route("/upload", methods=["POST"])
def upload_document():

    if "file" not in request.files:
        return {"error":"not file uploaded"}
    
    file=request.files["file"]

    file_path=os.path.join(UPLOAD_FOLDER, file.filename)

    file.save(file_path)

    if file.filename.endswith(".pdf"):
        text= extract_text_from_pdf(file_path)
        index_document(file.filename,text)

    elif file.filename.endswith((".png",".jpg",".jpeg")):
         text=extract_text_from_image(file_path)
         index_document(file.filename,text)
    else:
        return {"error":"Unsupported file type"}

    return {
        "message":"Document indexed successfully",
        "page_indexed":len(text)
    }      

    