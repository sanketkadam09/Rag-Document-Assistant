CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS document_pages(
    id SERIAL PRIMARY KEY,
    document_name TEXT,
    page_number INT,
    content TEXT,
    embedding VECTOR(3072)
)