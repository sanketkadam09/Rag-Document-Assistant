// src/components/ChatBox.jsx
import { useState, useRef } from "react";
import axios from "axios";
import Message from "./Message";

function ChatBox({ selectedDoc }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    scrollToBottom();

    // Add empty AI message for streaming
    const aiIndex = messages.length + 1;
    setMessages((prev) => [...prev, { role: "ai", text: "", sources: [] }]);

    setLoading(true);
    setInput("");

    try {
      const res = await axios.post("http://localhost:5000/ask", {
        question: input,
        document: selectedDoc || null, // send selected doc to backend
      });

      const aiText = res.data.answer;
      const sources = res.data.sources || [];

      // Streaming effect
      let displayedText = "";
      for (let i = 0; i < aiText.length; i++) {
        displayedText += aiText[i];

        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[aiIndex] = { role: "ai", text: displayedText, sources };
          return newMessages;
        });

        await new Promise((r) => setTimeout(r, 15)); // typing speed
        scrollToBottom();
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[aiIndex] = { role: "ai", text: "Failed to get AI response.", sources: [] };
        return newMessages;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full p-4 bg-white">
      <div className="flex-1 overflow-y-auto mb-2">
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
        <div ref={chatEndRef}></div>
      </div>

      <div className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about your documents..."
          className="flex-1 p-2 border rounded-l-md"
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded-r-md"
          disabled={loading}
        >
          {loading ? "..." : "Send"}
        </button>
      </div>
    </div>
  );
}

export default ChatBox;