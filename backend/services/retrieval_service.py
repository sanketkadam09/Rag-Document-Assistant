from db import get_db_connection
def retrieve_similar_pages(query_embedding):
    conn= get_db_connection()
    cursor=conn.cursor()

    cursor.execute(
        """
    SELECT document_name,page_number,content FROM document_pages
       ORDER BY embedding <-> %s::vector
       LIMIT 3
       """,
       (query_embedding,)
    )

    results=cursor.fetchall()

    cursor.close()
    conn.close()
    return results