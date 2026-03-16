function Message({ message }) {

  return (
    <div style={{ margin: "10px 0" }}>

      <b>{message.role === "user" ? "You" : "AI"}:</b>

      <p>{message.text}</p>

      {message.sources && (
        <small>
          Source: {message.sources.join(", ")}
        </small>
      )}

    </div>
  );
}

export default Message;