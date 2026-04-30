from flask_sqlalchemy import SQLAlchemy
from pgvector.sqlalchemy import Vector
db=SQLAlchemy()


class DocumentPage(db.Model):
    __tablename__ = "document_pages"

    id=db.Column(db.Integer,primary_key=True)
    document_name= db.Column(db.String(255),nullable=False)
    page_number= db.Column(db.String(50), nullable=False)
    content= db.Column(db.Text,nullable=False)
    embedding= db.Column(Vector(3072))