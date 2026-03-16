import { useState } from "react";
import axios from "axios";
import Message from "./Message";

function ChatBox() {

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {

    const userMessage = { role: "user", text: input };

    setMessages([...messages, userMessage]);

    const res = await axios.post("http://localhost:5000/ask", {
      question: input
    });

    const aiMessage = {
      role: "ai",
      text: res.data.answer,
      sources: res.data.sources
    };

    setMessages(prev => [...prev, aiMessage]);

    setInput("");
  };

  return (
    <div style={{ padding: "20px" }}>

      <div style={{ height: "80vh", overflowY: "scroll" }}>
        {messages.map((msg, index) => (
          <Message key={index} message={msg} />
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask about your documents..."
      />

      <button onClick={sendMessage}>Send</button>

    </div>
  );
}

export default ChatBox;