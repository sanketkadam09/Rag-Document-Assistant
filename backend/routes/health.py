from flask import Blueprint 
from db import get_db_connection

health_bp=Blueprint("health",__name__)

@health_bp.route("/health")
def health_check():
    try:
        conn= get_db_connection()
        conn.close()
        return {"status":"Server running and DB connected"}
    except:
         return {"status":"Database connection failed"}
    
    