import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import { MessageSquare, Send, MinusSquare, Square, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TypewriterText = ({ text, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex(currentIndex + 1);
      }, 15);

      return () => clearTimeout(timeout);
    } else if (onComplete) {
      onComplete();
    }
  }, [currentIndex, text, onComplete]);

  return <span>{displayedText}</span>;
};

TypewriterText.propTypes = {
  text: PropTypes.string.isRequired,
  onComplete: PropTypes.func,
};

const Chatbot = ({ detectedEmotion }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [query, setQuery] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  // Optimized animation variants
  const chatContainerVariants = {
    expanded: {
      height: "auto",
      opacity: 1,
      transition: { duration: 0.2, ease: "easeOut" },
    },
    collapsed: {
      height: 0,
      opacity: 0,
      transition: { duration: 0.1, ease: "easeIn" },
    },
  };

  const buttonVariants = {
    hover: { scale: 1.05, transition: { duration: 0.1 } },
    tap: { scale: 0.95, transition: { duration: 0.1 } },
  };

  const widgetVariants = {
    initial: { scale: 0.8, opacity: 0 },
    animate: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.1,
        ease: "easeOut",
      },
    },
    exit: {
      scale: 0.8,
      opacity: 0,
      transition: {
        duration: 0.1,
      },
    },
  };

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

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", text: message, isNew: true },
      ]);
    }
  }, [detectedEmotion]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !isTyping) {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!query.trim() || isTyping) return;

    const userMessage = { sender: "user", text: query };
    setChatHistory((prev) => [...prev, userMessage]);
    setQuery("");
    setIsTyping(true);

    try {
      const res = await axios.post("/api/chat", {
        query,
        mood: detectedEmotion?.emotion,
      });
      const botMessage = {
        sender: "bot",
        text: res.data.response,
        isNew: true,
      };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error chatting with bot:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, something went wrong.",
        isNew: true,
      };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  return (
    <AnimatePresence mode="wait">
      {isMinimized ? (
        <motion.div
          key="minimized"
          className="fixed bottom-4 right-4"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 15,
            duration: 0.1,
          }}
        >
          <motion.button
            onClick={() => setIsMinimized(false)}
            className="bg-gradient-to-r from-blue-600 to-blue-500 p-3 rounded-full shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200"
            whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
            whileTap={{ scale: 0.9, transition: { duration: 0.1 } }}
          >
            <MessageSquare className="w-6 h-6 text-white" />
          </motion.button>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          className="fixed bottom-4 right-4 w-96"
          variants={widgetVariants}
          initial="initial"
          animate="animate"
          exit="exit"
        >
          <div className="backdrop-blur-xl bg-gray-900/90 rounded-2xl shadow-2xl border border-gray-700/50 overflow-hidden">
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
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    {isCollapsed ? (
                      <Square size={18} />
                    ) : (
                      <MinusSquare size={18} />
                    )}
                  </motion.button>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    onClick={handleMinimize}
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    <X size={18} />
                  </motion.button>
                </div>
              </div>
            </div>

            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={chatContainerVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  <div
                    className="h-96 overflow-y-auto p-4 bg-gray-900/50"
                    style={{ scrollBehavior: "smooth" }}
                  >
                    {chatHistory.length > 0 ? (
                      chatHistory.map((message, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
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
                            {message.sender === "bot" && message.isNew ? (
                              <TypewriterText
                                text={message.text}
                                onComplete={() => {
                                  if (index === chatHistory.length - 1) {
                                    setIsTyping(false);
                                    setChatHistory((prev) =>
                                      prev.map((msg, i) =>
                                        i === index
                                          ? { ...msg, isNew: false }
                                          : msg
                                      )
                                    );
                                  }
                                }}
                              />
                            ) : (
                              message.text
                            )}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.2 }}
                        className="h-full flex items-center justify-center"
                      >
                        <p className="text-gray-400 text-center">
                          👋 Hi! I can help recommend music based on your
                          emotions.
                        </p>
                      </motion.div>
                    )}
                    <div ref={chatEndRef} />
                  </div>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="p-4 bg-gray-900/90 border-t border-gray-700/50"
                  >
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                        placeholder={
                          isTyping ? "Please wait..." : "Type your message..."
                        }
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isTyping}
                      />
                      <motion.button
                        variants={buttonVariants}
                        whileHover="hover"
                        whileTap="tap"
                        className={`px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 ${
                          isTyping
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:from-blue-700 hover:to-blue-600"
                        }`}
                        onClick={handleSendMessage}
                        disabled={isTyping}
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

Chatbot.propTypes = {
  detectedEmotion: PropTypes.shape({
    emotion: PropTypes.string,
  }),
};

export default Chatbot;
