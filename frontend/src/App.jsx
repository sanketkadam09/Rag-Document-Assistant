// src/App.jsx
import { useState } from "react";
import ChatBox from "./components/ChatBox";
import Upload from "./components/Upload";

function App() {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "#0f1117", fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600&display=swap');

        * { box-sizing: border-box; }

        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #2a2d3a; border-radius: 4px; }

        .sidebar-panel {
          background: #13161f;
          border-right: 1px solid #1e2130;
          transition: width 0.3s cubic-bezier(0.4,0,0.2,1);
        }

        .glow-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: #4ade80;
          box-shadow: 0 0 8px #4ade80;
          animation: pulse-dot 2s infinite;
        }

        @keyframes pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }

        .app-logo {
          background: linear-gradient(135deg, #6366f1, #a855f7);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-family: 'Space Grotesk', sans-serif;
          font-weight: 600;
          letter-spacing: -0.5px;
        }

        .toggle-btn {
          background: #1e2130;
          border: 1px solid #2a2d3a;
          color: #9ca3af;
          border-radius: 8px;
          width: 32px; height: 32px;
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }
        .toggle-btn:hover { background: #252838; color: #e5e7eb; }
      `}</style>

      {/* Sidebar */}
      <div
        className="sidebar-panel flex flex-col"
        style={{ width: sidebarOpen ? "280px" : "0px", minWidth: sidebarOpen ? "280px" : "0px", overflow: "hidden" }}
      >
        {/* Sidebar Header */}
        <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid #1e2130" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: "linear-gradient(135deg, #6366f1, #a855f7)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 16
            }}>📄</div>
            <span className="app-logo" style={{ fontSize: 18 }}>DocMind</span>
          </div>
          <p style={{ color: "#4b5563", fontSize: 11, marginTop: 4, paddingLeft: 2 }}>RAG Document Assistant</p>
        </div>

        <Upload selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} />
      </div>

      {/* Main Area */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Top bar */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          padding: "12px 20px",
          background: "#13161f",
          borderBottom: "1px solid #1e2130"
        }}>
          <button className="toggle-btn" onClick={() => setSidebarOpen(o => !o)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="glow-dot"></div>
            <span style={{ color: "#6b7280", fontSize: 13 }}>
              {selectedDoc
                ? <span style={{ color: "#a5b4fc" }}>Chatting with: <strong style={{ color: "#c4b5fd" }}>{selectedDoc}</strong></span>
                : <span>No document selected — chatting generally</span>
              }
            </span>
          </div>
        </div>

        <ChatBox selectedDoc={selectedDoc} />
      </div>
    </div>
  );
}

export default App;