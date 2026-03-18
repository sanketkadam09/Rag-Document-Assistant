from flask import Blueprint, request, jsonify
from db import get_db_connection
import os

doc_bp = Blueprint("documents", __name__)

UPLOAD_FOLDER = "/app/uploads"  # folder where PDFs are stored

# Existing route
@doc_bp.route("/documents", methods=["GET"])
def get_documents():
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT DISTINCT document_name FROM document_pages")
    docs = cursor.fetchall()
    cursor.close()
    conn.close()
    return {"documents": [d[0] for d in docs]}

# New route to delete a document
@doc_bp.route("/documents/<doc_name>", methods=["DELETE"])
def delete_document(doc_name):
    conn = get_db_connection()
    cursor = conn.cursor()

    try:
        # Delete from database
        cursor.execute(
            "DELETE FROM document_pages WHERE document_name = %s", (doc_name,)
        )
        conn.commit()

        # Delete actual file from uploads folder
        file_path = os.path.join(UPLOAD_FOLDER, doc_name)
        if os.path.exists(file_path):
            os.remove(file_path)

        return jsonify({"message": f"{doc_name} deleted successfully"}), 200
    except Exception as e:
        print("Delete failed:", e)
        return jsonify({"error": "Delete failed"}), 500
    finally:
        cursor.close()
        conn.close()