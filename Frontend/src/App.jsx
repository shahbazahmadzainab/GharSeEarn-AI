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
      const apiUrl = import.meta.env.VITE_API_URL;

      if (!apiUrl) {
        throw new Error("VITE_API_URL is missing");
      }

      const url =
        apiUrl + "/chat?message=" + encodeURIComponent(message);

      const res = await fetch(url, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();

      setResponse(data.response || "No response received.");
    } catch (error) {
      console.error("Chat error:", error);
      setResponse("Sorry, something went wrong. Please try again.");
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
    <div className="app">
      <div className="container">
        <div className="header">
          <h1>🏠 GharSeEarn AI</h1>

          <p className="subtitle">
            Your Home-Based Career & Skills Assistant
          </p>
        </div>

        <div className="chat-box">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Tell me about your skills, experience, interests, and available time..."
            rows={5}
            disabled={loading}
          />

          <button
            onClick={sendMessage}
            disabled={loading || !message.trim()}
          >
            {loading ? "Thinking..." : "Ask GharSeEarn AI"}
          </button>

          {response && (
            <div className="response">
              <h2>🤖 AI Response</h2>
              <p>{response}</p>
            </div>
          )}
        </div>

        <p className="footer-text">
          💡 Get personalized career and home-based earning guidance.
        </p>
      </div>
    </div>
  );
}

export default App;