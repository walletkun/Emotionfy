import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { MessageSquare, Send, MinusSquare, Square, X } from "lucide-react";

const Chatbot = ({ detectedEmotion }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  // Auto-respond when emotion is detected
  useEffect(() => {
    if (detectedEmotion?.emotion) {
      const emotion = detectedEmotion.emotion.toLowerCase();
      let message = "";

      // Customize responses based on emotion
      switch (emotion) {
        case "happy":
          message =
            "I notice you're feeling happy! Would you like me to suggest some upbeat songs to match your mood? 😊";
          break;
        case "sad":
          message =
            "I see you're feeling down. I can recommend some comforting music to help lift your spirits. Would you like that? 💙";
          break;
        case "angry":
          message =
            "I sense you're feeling angry. Would you like some calming music recommendations to help you relax? 🎵";
          break;
        case "surprise":
          message =
            "You seem surprised! How about some exciting music to match that energy? ✨";
          break;
        case "neutral":
          message =
            "Your mood seems neutral. Would you like some balanced music recommendations? 🎧";
          break;
        case "fear":
          message =
            "I notice you're feeling anxious. Would you like some soothing music to help you feel more at ease? 🌟";
          break;
        case "disgust":
          message =
            "I sense some negative emotions. Would you like music recommendations to help shift your mood? 🎵";
          break;
        default:
          message = `I noticed a change in your emotion to ${emotion}. Would you like some music recommendations? 🎵`;
      }

      // Add the auto-response to chat history
      setChatHistory((prev) => [...prev, { sender: "bot", text: message }]);
    }
  }, [detectedEmotion]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);

    try {
      const res = await axios.post("/api/chat", {
        query,
        mood: detectedEmotion?.emotion,
      });
      const botMessage = { sender: "bot", text: res.data.response };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error chatting with bot:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong.",
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setQuery("");
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
        >
          <MessageSquare className="w-6 h-6 text-white" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96">
      <div className="backdrop-blur-xl bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-gray-900 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageSquare className="w-6 h-6 text-blue-400" />
              <h2 className="text-lg font-semibold text-white">
                Emotion Assistant
                {detectedEmotion && (
                  <span className="text-sm ml-2 text-blue-400 opacity-75">
                    Mood: {detectedEmotion.emotion}
                  </span>
                )}
              </h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                {isCollapsed ? <Square size={18} /> : <MinusSquare size={18} />}
              </button>
              <button
                onClick={() => setIsMinimized(true)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Chat Display */}
        {!isCollapsed && (
          <>
            <div
              className="h-96 overflow-y-auto p-4 bg-gray-900/50"
              style={{ scrollBehavior: "smooth" }}
            >
              {chatHistory.length > 0 ? (
                chatHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.sender === "user"
                        ? "justify-end"
                        : "justify-start"
                    } mb-4`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                        message.sender === "user"
                          ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white"
                          : "bg-gray-800/90 text-gray-100"
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-400 text-center">
                    👋 Hi! I can help recommend music based on your emotions.
                  </p>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 bg-gray-900/90 border-t border-gray-700/50">
              <div className="flex space-x-2">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  placeholder="Type your message..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                  onClick={handleSendMessage}
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chatbot;
