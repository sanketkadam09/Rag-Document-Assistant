// src/components/Message.jsx
function Message({ message }) {
  return (
    <div className="mb-4">
      <div className={`font-bold mb-1 ${message.role === "user" ? "text-blue-600" : "text-green-600"}`}>
        {message.role === "user" ? "You" : "AI"}:
      </div>

      <div className={`p-3 rounded-lg max-w-xl ${
        message.role === "user" ? "bg-blue-100" : "bg-green-100"
      }`}>
        {message.text}
      </div>

      {message.sources && message.sources.length > 0 && (
        <div className="mt-1 flex flex-wrap gap-2">
          {message.sources.map((source, idx) => (
            <span
              key={idx}
              className="bg-gray-300 text-gray-800 text-xs px-2 py-1 rounded-full cursor-pointer hover:bg-gray-400"
              title="Click to see source page"
            >
              {source}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export default Message;