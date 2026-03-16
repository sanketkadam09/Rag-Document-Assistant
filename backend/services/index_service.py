from db import get_db_connection
from services.embedding_service import create_embedding

def index_document(document_name,pages):
    conn=get_db_connection()
    cursor=conn.cursor()

    for i,page_text in enumerate(pages):
        embedding =create_embedding(page_text)
        
        cursor.execute(
            """
            INSERT INTO document_pages(document_name,page_number,content,embedding)
            VALUES (%s,%s,%s,%s)
             """,
             (document_name,i+1,page_text,embedding)
             
 )
    conn.commit()
    cursor.close()
    conn.close()
