// src/App.jsx
import { useState } from "react";

import ChatBox from "./components/ChatBox";
import Upload  from "./components/upload";

function App() {
  // State to track which document is selected
  const [selectedDoc, setSelectedDoc] = useState(null);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r p-4 bg-gray-100">
        <Upload selectedDoc={selectedDoc} setSelectedDoc={setSelectedDoc} />
      </div>

      {/* Chat Area */}
      <div className="w-3/4 p-4">
        <ChatBox selectedDoc={selectedDoc} />
      </div>
    </div>
  );
}

export default App;