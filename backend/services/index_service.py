from db import get_db_connection
from services.embedding_service import create_embedding
from utils.text_chunker import chunk_text


def index_document(document_name, pages):
    conn = get_db_connection()
    cursor = conn.cursor()

    for i, page_text in enumerate(pages):

        # Remove null characters from extracted text
        if page_text:
            page_text = page_text.replace("\x00", "").strip()

        chunks = chunk_text(page_text)

        for j, chunk in enumerate(chunks):

            # Extra safety for each chunk
            if chunk:
                chunk = chunk.replace("\x00", "").strip()

            embedding = create_embedding(chunk)

            cursor.execute(
                """
                INSERT INTO document_pages(document_name, page_number, content, embedding)
                VALUES (%s, %s, %s, %s)
                """,
                (document_name, f"{i+1}.{j+1}", chunk, embedding)
            )

    conn.commit()
    cursor.close()
    conn.close()