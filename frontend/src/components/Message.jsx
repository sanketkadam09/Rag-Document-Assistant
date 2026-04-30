// src/components/Message.jsx
import { useState } from "react";

function Message({ message }) {
  const isUser = message.role === "user";
  const [copiedIdx, setCopiedIdx] = useState(null);

  const copyText = () => {
    navigator.clipboard.writeText(message.text);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: isUser ? "flex-end" : "flex-start",
        marginBottom: "20px",
        animation: "msgIn 0.25s ease-out",
      }}
    >
      <style>{`
        @keyframes msgIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .msg-meta {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 6px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .avatar {
          width: 22px; height: 22px;
          border-radius: 6px;
          display: flex; align-items: center; justify-content: center;
          font-size: 11px;
        }

        .msg-bubble {
          max-width: 560px;
          padding: 12px 16px;
          border-radius: 14px;
          font-size: 14px;
          line-height: 1.65;
          position: relative;
        }

        .user-bubble {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          color: #fff;
          border-bottom-right-radius: 4px;
        }

        .ai-bubble {
          background: #13161f;
          border: 1px solid #1e2130;
          color: #d1d5db;
          border-bottom-left-radius: 4px;
        }

        .copy-btn {
          background: transparent;
          border: none;
          cursor: pointer;
          color: #4b5563;
          padding: 2px 4px;
          border-radius: 4px;
          font-size: 11px;
          opacity: 0;
          transition: opacity 0.2s, color 0.2s;
        }

        .msg-row:hover .copy-btn { opacity: 1; }
        .copy-btn:hover { color: #9ca3af; }

        .source-chip {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: #1a1d27;
          border: 1px solid #252838;
          color: #9ca3af;
          font-size: 11px;
          padding: 3px 10px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.15s;
          font-family: 'DM Sans', sans-serif;
        }

        .source-chip:hover {
          background: #252838;
          border-color: #6366f1;
          color: #a5b4fc;
        }

        .sources-label {
          font-size: 11px;
          color: #374151;
          margin-bottom: 6px;
          text-transform: uppercase;
          letter-spacing: 0.06em;
          font-weight: 600;
        }
      `}</style>

      {/* Meta row */}
      <div className="msg-meta msg-row" style={{ color: isUser ? "#818cf8" : "#6b7280" }}>
        {!isUser && (
          <div className="avatar" style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>✦</div>
        )}
        <span>{isUser ? "You" : "DocMind"}</span>
        {!isUser && (
          <button className="copy-btn" onClick={copyText} title="Copy response">
            📋 Copy
          </button>
        )}
        {isUser && (
          <div className="avatar" style={{ background: "#1e2130" }}>👤</div>
        )}
      </div>

      {/* Bubble */}
      <div className={`msg-bubble ${isUser ? "user-bubble" : "ai-bubble"}`}>
        {message.text || (
          <span style={{ color: "#4b5563", fontStyle: "italic" }}>Thinking…</span>
        )}
      </div>

      {/* Sources */}
      {message.sources && message.sources.length > 0 && (
        <div style={{ marginTop: 10, maxWidth: 560 }}>
          <div className="sources-label">Sources</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {message.sources.map((source, idx) => (
              <span key={idx} className="source-chip" title={source}>
                <span>📎</span>
                {source}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Message;