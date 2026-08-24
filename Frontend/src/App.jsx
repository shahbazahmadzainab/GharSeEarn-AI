import { useState } from "react";
import "./index.css";

function App() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");

    try {
     const res = await fetch(
  `http://127.0.0.1:8000/chat?message=${encodeURIComponent(message)}`,
  {
    method: "POST",
  }
);

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      setResponse(data.response);
    } catch (error) {
      console.error(error);
      setResponse("Sorry, something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="container">
        <h1>🏠 GharSeEarn AI</h1>

        <p className="subtitle">
          Your Home-Based Career & Skills Assistant
        </p>

        <div className="chat-box">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell me about your skills, experience, interests, and available time..."
            rows="5"
          />

          <button onClick={sendMessage} disabled={loading}>
            {loading ? "Thinking..." : "Ask GharSeEarn AI"}
          </button>

          {response && (
            <div className="response">
              <h2>AI Response</h2>
              <p>{response}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;