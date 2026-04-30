// src/components/Upload.jsx
import { useEffect, useState, useRef } from "react";
import axios from "axios";

function Upload({ selectedDoc, setSelectedDoc }) {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://localhost:5000/documents");
      setDocs(res.data.documents);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => { fetchDocuments(); }, []);

  const handleUpload = async (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    try {
      setUploading(true);
      await axios.post("http://localhost:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchDocuments();
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleFileInput = (e) => handleUpload(e.target.files[0]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  const handleDelete = async (doc) => {
    if (!window.confirm(`Delete "${doc}"?`)) return;
    try {
      await axios.delete(`http://localhost:5000/documents/${doc}`);
      if (selectedDoc === doc) setSelectedDoc(null);
      fetchDocuments();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  const getFileIcon = (name) => {
    const ext = name.split(".").pop().toLowerCase();
    if (ext === "pdf") return "📕";
    if (["doc", "docx"].includes(ext)) return "📘";
    if (["txt", "md"].includes(ext)) return "📄";
    if (["csv", "xlsx"].includes(ext)) return "📊";
    return "📎";
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
      <style>{`
        .upload-zone {
          border: 1.5px dashed #252838;
          border-radius: 12px;
          padding: 18px 12px;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s;
          background: #0f1117;
          margin: 16px;
        }
        .upload-zone:hover, .upload-zone.drag-over {
          border-color: #6366f1;
          background: rgba(99,102,241,0.05);
        }

        .upload-icon {
          font-size: 24px;
          margin-bottom: 6px;
          display: block;
        }

        .upload-label {
          font-size: 12px;
          color: #6b7280;
          line-height: 1.5;
        }

        .upload-label strong { color: #a5b4fc; }

        .upload-spinner {
          display: inline-block;
          width: 16px; height: 16px;
          border: 2px solid #252838;
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 0.6s linear infinite;
        }
        @keyframes spin { to { transform: rotate(360deg); } }

        .section-label {
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          font-weight: 600;
          color: #374151;
          padding: 0 16px;
          margin-bottom: 8px;
        }

        .doc-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 9px 16px;
          cursor: pointer;
          border-radius: 0;
          transition: background 0.15s;
          border-left: 3px solid transparent;
          position: relative;
        }

        .doc-item:hover { background: #1a1d27; }
        .doc-item.active {
          background: rgba(99,102,241,0.08);
          border-left-color: #6366f1;
        }

        .doc-icon {
          font-size: 16px;
          flex-shrink: 0;
        }

        .doc-name {
          flex: 1;
          font-size: 13px;
          color: #9ca3af;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'DM Sans', sans-serif;
        }

        .doc-item.active .doc-name { color: #a5b4fc; }

        .del-btn {
          background: transparent;
          border: none;
          color: #4b5563;
          cursor: pointer;
          padding: 3px;
          border-radius: 4px;
          opacity: 0;
          transition: opacity 0.15s, color 0.15s;
          display: flex;
        }
        .doc-item:hover .del-btn { opacity: 1; }
        .del-btn:hover { color: #ef4444; }

        .docs-list {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 16px;
        }

        .empty-docs {
          padding: 24px 16px;
          text-align: center;
          color: #374151;
          font-size: 12px;
          line-height: 1.6;
        }

        .badge {
          background: #1e2130;
          color: #6b7280;
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 10px;
          flex-shrink: 0;
        }

        .active .badge {
          background: rgba(99,102,241,0.2);
          color: #818cf8;
        }
      `}</style>

      {/* Drop Zone */}
      <div
        className={`upload-zone ${dragOver ? "drag-over" : ""}`}
        onClick={() => !uploading && fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        {uploading ? (
          <>
            <span className="upload-spinner" style={{ display: "block", margin: "0 auto 8px" }}></span>
            <span className="upload-label">Uploading…</span>
          </>
        ) : (
          <>
            <span className="upload-icon">⬆️</span>
            <div className="upload-label">
              <strong>Click to upload</strong> or drag & drop<br />
              PDF, DOCX, TXT, CSV
            </div>
          </>
        )}
        <input
          ref={fileInputRef}
          type="file"
          style={{ display: "none" }}
          onChange={handleFileInput}
          disabled={uploading}
        />
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1px solid #1e2130", margin: "0 0 12px" }}></div>

      {/* Documents List */}
      <div className="section-label">
        Documents · {docs.length}
      </div>

      <div className="docs-list">
        {docs.length === 0 ? (
          <div className="empty-docs">
            <div style={{ fontSize: 24, marginBottom: 8 }}>🗂️</div>
            No documents yet.<br />Upload one to get started.
          </div>
        ) : (
          docs.map((doc) => (
            <div
              key={doc}
              className={`doc-item ${selectedDoc === doc ? "active" : ""}`}
              onClick={() => setSelectedDoc(doc === selectedDoc ? null : doc)}
            >
              <span className="doc-icon">{getFileIcon(doc)}</span>
              <span className="doc-name" title={doc}>{doc}</span>
              {selectedDoc === doc && <span className="badge">active</span>}
              <button
                className="del-btn"
                onClick={(e) => { e.stopPropagation(); handleDelete(doc); }}
                title="Delete document"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/>
                </svg>
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Upload;