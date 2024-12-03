import React, { useState } from "react";
import axios from "axios";

const Chatbot = () => {
  const [query, setQuery] = useState("");
  const [mood, setMood] = useState("");
  const [chatHistory, setChatHistory] = useState([]);

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setChatHistory([...chatHistory, userMessage]);

    try {
      const res = await axios.post("/api/chat", { query, mood });
      const botMessage = { sender: "bot", text: res.data.response };

      setChatHistory((prevHistory) => [...prevHistory, botMessage]);
    } catch (error) {
      console.error("Error chatting with bot:", error);
      const errorMessage = { sender: "bot", text: "Sorry, something went wrong." };
      setChatHistory((prevHistory) => [...prevHistory, errorMessage]);
    }

    setQuery(""); // Clear input box after sending
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  return (
    <div
  className="chatbot-container border rounded-lg shadow-lg p-4 bg-white"
  style={{
    width: "400px",
    fontFamily: "Arial",
    color: "black",
    margin: "auto",
    display: "block",
    position: "relative",
    top: "50px", // Push it down to avoid overlapping
  }}
>
      {/* Header Section */}
      <div className="chatbot-header flex items-center mb-4">
        <img
          src="/chatbot-icon.png" // Ensure the icon is correctly placed in the public folder
          alt="Chatbot Icon"
          style={{ width: "40px", height: "40px", marginRight: "10px" }}
        />
        <h2 className="text-lg font-bold">Chat with our Emotion-Aware Bot</h2>
      </div>

      {/* Chat Display Section */}
      <div
        className="chat-display border rounded-lg overflow-y-auto p-4 mb-4"
        style={{ height: "500px", backgroundColor: "#f9f9f9" }}
      >
        {chatHistory.length > 0 ? (
          chatHistory.map((message, index) => (
            <div
              key={index}
              className={`message ${
                message.sender === "user" ? "text-right" : "text-left"
              }`}
              style={{ marginBottom: "10px" }}
            >
              <span
                className={`inline-block px-3 py-2 rounded-lg ${
                  message.sender === "user" ? "bg-blue-200" : "bg-gray-200"
                }`}
                style={{ color: "black" }}
              >
                {message.text}
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center">Start chatting with the bot!</p>
        )}
      </div>

      {/* Input Section */}
      <div className="chat-input flex items-center">
        <input
          type="text"
          className="flex-grow border rounded-lg p-2 mr-2"
          placeholder="Type your message here..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          style={{ color: "black", backgroundColor: "white" }}
        />
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={handleSendMessage}
          style={{ backgroundColor: "#007BFF" }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatbot;
