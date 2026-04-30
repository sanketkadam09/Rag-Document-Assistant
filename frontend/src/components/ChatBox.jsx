// src/components/ChatBox.jsx
import { useState, useRef, useEffect } from "react";
import VoiceRecorder from "./VoiceRecorder";
import axios from "axios";
import Message from "./Message";

function ChatBox({ selectedDoc }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [inputFromVoice, setInputFromVoice] = useState("");
  const inputRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { scrollToBottom(); }, [messages]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    scrollToBottom();

    const aiIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "ai", text: "", sources: [] }]);

    setLoading(true);
    try {
      const isVoiceQuestion = input === inputFromVoice;
      const res = await axios.post("http://localhost:5000/ask", {
        question: input,
        document: selectedDoc || null,
        is_voice: isVoiceQuestion,
      });

      const aiText = res.data.answer;
      const sources = res.data.sources || [];
      const audioUrl = res.data.audio_url;

      if (audioUrl) {
        const audio = new Audio(audioUrl);
        audio.play();
      }

      let displayedText = "";
      for (let i = 0; i < aiText.length; i++) {
        displayedText += aiText[i];
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[aiIndex] = { role: "ai", text: displayedText, sources };
          return newMessages;
        });
        await new Promise((r) => setTimeout(r, 15));
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[aiIndex] = {
          role: "ai",
          text: "Failed to get a response. Please try again.",
          sources: [],
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#0f1117" }}>
      <style>{`
        .chat-messages {
          scrollbar-width: thin;
          scrollbar-color: #2a2d3a transparent;
        }

        .input-wrapper {
          background: #13161f;
          border-top: 1px solid #1e2130;
          padding: 16px 20px;
        }

        .input-box {
          background: #1a1d27;
          border: 1px solid #252838;
          border-radius: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 8px 8px 16px;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .input-box:focus-within {
          border-color: #6366f1;
          box-shadow: 0 0 0 3px rgba(99,102,241,0.12);
        }

        .msg-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: #e5e7eb;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          resize: none;
          line-height: 1.5;
        }

        .msg-input::placeholder { color: #4b5563; }

        .send-btn {
          width: 38px; height: 38px;
          border-radius: 10px;
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          border: none;
          cursor: pointer;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.2s;
          flex-shrink: 0;
        }
        .send-btn:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }
        .send-btn:disabled { opacity: 0.5; cursor: not-allowed; }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          gap: 16px;
          color: #374151;
          user-select: none;
        }

        .empty-icon {
          width: 64px; height: 64px;
          border-radius: 20px;
          background: #13161f;
          border: 1px solid #1e2130;
          display: flex; align-items: center; justify-content: center;
          font-size: 28px;
        }

        .loading-dots span {
          display: inline-block;
          width: 6px; height: 6px;
          border-radius: 50%;
          background: #6366f1;
          animation: bounce 1.2s infinite ease-in-out;
        }
        .loading-dots span:nth-child(1) { animation-delay: 0s; }
        .loading-dots span:nth-child(2) { animation-delay: 0.2s; margin: 0 4px; }
        .loading-dots span:nth-child(3) { animation-delay: 0.4s; }
        @keyframes bounce {
          0%, 80%, 100% { transform: scale(0.8); opacity: 0.5; }
          40% { transform: scale(1.2); opacity: 1; }
        }

        .hint-text {
          font-size: 11px;
          color: #374151;
          text-align: center;
          margin-top: 6px;
        }
      `}</style>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto chat-messages" style={{ padding: "24px 20px" }}>
        {messages.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">💬</div>
            <div style={{ textAlign: "center" }}>
              <p style={{ color: "#6b7280", fontSize: 15, fontWeight: 500 }}>Start a conversation</p>
              <p style={{ color: "#374151", fontSize: 13, marginTop: 4 }}>
                {selectedDoc ? `Ask anything about "${selectedDoc}"` : "Upload a document or ask a general question"}
              </p>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, idx) => (
              <Message key={idx} message={msg} />
            ))}
            {loading && messages[messages.length - 1]?.text === "" && (
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 0" }}>
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 14, flexShrink: 0
                }}>✦</div>
                <div className="loading-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={chatEndRef}></div>
      </div>

      {/* Input Area */}
      <div className="input-wrapper">
        <div className="input-box">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about your documents..."
            className="msg-input"
            disabled={loading}
          />

          <VoiceRecorder setInput={setInput} setInputFromVoice={setInputFromVoice} />

          <button className="send-btn" onClick={sendMessage} disabled={loading || !input.trim()}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13"/>
              <polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          </button>
        </div>
        <p className="hint-text">Press Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}

export default ChatBox;