// src/components/ChatBox.jsx
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import Message from "./Message";

function ChatBox({ selectedDoc }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () =>
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
      const res = await axios.post("http://13.234.168.225/ask", {
        question: input,
        document: selectedDoc || null,
      });

      const aiText = res.data.answer;
      const sources = res.data.sources || [];

      // Typing effect
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
          text: "Failed to get AI response.",
          sources: [],
        };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 shadow-lg rounded-lg overflow-hidden">
      {/* Chat header */}
      <div className="bg-white border-b p-4 flex items-center justify-between shadow-sm">
        <h2 className="text-lg font-semibold text-gray-700">
          Chat with AI
        </h2>
        {selectedDoc && (
          <span className="text-sm text-gray-500 italic">
            Doc: {selectedDoc}
          </span>
        )}
      </div>

      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, idx) => (
          <Message key={idx} message={msg} />
        ))}
        <div ref={chatEndRef}></div>
      </div>

    {/* Input section */}
<div className="bg-gray-300 p-4 flex items-center space-x-3 rounded-t-xl shadow-inner">
  <input
    type="text"
    value={input}
    onChange={(e) => setInput(e.target.value)}
    placeholder="Ask about your documents..."
    className="flex-1 px-5 py-3 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm text-gray-700 placeholder-gray-400 transition-all duration-200"
    disabled={loading}
    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
  />
  <button
    onClick={sendMessage}
    disabled={loading}
    className={`flex items-center justify-center px-6 py-3 rounded-full font-semibold text-white shadow-md transition-all duration-200 ${
      loading
        ? "bg-blue-300 cursor-not-allowed"
        : "bg-blue-600 hover:bg-blue-700"
    }`}
  >
    {loading ? "..." : "Send"}
  </button>
</div>
    </div>
  );
}

export default ChatBox;