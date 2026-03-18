// src/components/Upload.jsx
import { useEffect, useState } from "react";
import axios from "axios";

function Upload({ selectedDoc, setSelectedDoc }) {
  const [docs, setDocs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = async () => {
    try {
      const res = await axios.get("http://13.234.168.225/documents");
      setDocs(res.data.documents);
    } catch (err) {
      console.error("Failed to fetch documents:", err);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      await axios.post("http://13.234.168.225/upload", formData, {
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

  const handleDelete = async (doc) => {
    if (!window.confirm(`Are you sure you want to delete ${doc}?`)) return;

    try {
      await axios.delete(`http://13.234.168.225/documents/${doc}`);
      alert(`${doc} deleted successfully`);
      if (selectedDoc === doc) setSelectedDoc(null);
      fetchDocuments();
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Delete failed");
    }
  };

  return (
    <div className="p-4 bg-gray-100 h-full flex flex-col">
      <h3 className="text-lg font-bold mb-2">Upload Document</h3>
      <input
        type="file"
        onChange={handleUpload}
        className="mb-4 border p-1"
        disabled={uploading}
      />

      <h3 className="text-lg font-bold mb-2">Document History</h3>
      {docs.length === 0 ? (
        <p className="text-gray-500">No documents uploaded yet.</p>
      ) : (
        <ul className="flex-1 overflow-y-auto">
          {docs.map((doc) => (
            <li
              key={doc}
              className={`flex justify-between items-center p-2 mb-1 rounded cursor-pointer hover:bg-blue-400 ${
                selectedDoc === doc ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              <span
                onClick={() => setSelectedDoc(doc)}
                className="flex-1"
              >
                {doc}
              </span>
              <button
                onClick={() => handleDelete(doc)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Upload;