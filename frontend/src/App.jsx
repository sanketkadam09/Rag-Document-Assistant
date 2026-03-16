import ChatBox from "./components/ChatBox";
import Upload from "./components/Upload";

function App() {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      
      <div style={{ width: "25%", borderRight: "1px solid #ccc", padding: "20px" }}>
        <Upload />
      </div>

      <div style={{ width: "75%" }}>
        <ChatBox />
      </div>

    </div>
  );
}

export default App;