Rag-Document-Assistant

An AI-powered document assistant built using Retrieval-Augmented Generation (RAG) that allows users to upload documents and ask questions in natural language. The system retrieves relevant document content using vector embeddings and generates intelligent answers using the Gemini API.

🚀 Features
📄 Upload and process PDF documents

🔍 Semantic search using embeddings
🤖 AI-powered question answering
🧠 Retrieval-Augmented Generation (RAG)
⚡ Fast vector similarity search with pgvector
💬 Interactive chat system
☁️ CI/CD setup using GitHub Actions
📚 Context-aware answers from uploaded documents
🛠️ Tech Stack
Frontend
React.js
Backend
Flask (Python)
AI & Embeddings
Gemini API
Embedding Models
Database
PostgreSQL
pgvector
GitHub Actions

⚙️ Installation & Setup
1️⃣ Clone Repository
git clone https://github.com/sanketkadam09/Rag-Document-Assistant.git
cd Rag-Document-Assistant


Install Dependencies
pip install -r requirements.txt

Run Flask Server
python app.py


Frontend Setup
Move to Frontend
cd frontend
Install Packages
npm install
Start React App
npm run dev

🧠 How RAG Works In This Project
User uploads a PDF document
Text is extracted from the document
Document is split into smaller chunks
Embeddings are generated
Embeddings are stored in PostgreSQL using pgvector
User asks a question
Similar document chunks are retrieved
Gemini API generates a contextual response


User Question
      ↓
Embedding Generation
      ↓
pgvector Similarity Search
      ↓
Relevant Chunks Retrieved
      ↓
Gemini API
      ↓
Final AI Response



LangChain
PyPDF
REST APIs
