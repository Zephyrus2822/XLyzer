import React, { useState, useEffect, useRef } from "react";
import { MessageSquare, X, SendHorizonal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: "bot", text: "Hey there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [typingIndex, setTypingIndex] = useState(0);
  const [currentTypingText, setCurrentTypingText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const toggleChat = () => setIsOpen((prev) => !prev);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setIsTyping(true);
    setTypingIndex(0);
    setCurrentTypingText("");

    setTimeout(() => {
      fetch("http://localhost:5001/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: userMessage.text }),
      })
        .then((res) => res.json())
        .then((data) => {
          const replyText = data.reply || "Sorry, something went wrong.";
          setMessages((prev) => [
            ...prev,
            { from: "bot", text: replyText, animated: true },
          ]);
        })
        .catch((err) => {
          console.error("Chatbot API Error:", err);
          setMessages((prev) => [
            ...prev,
            {
              from: "bot",
              text: "Oops! Failed to connect to the AI. Try again later.",
              animated: false,
            },
          ]);
          setIsTyping(false);
        });
    }, 500);
  };

  // Animate bot typing
  useEffect(() => {
    const latest = messages[messages.length - 1];
    if (latest?.from === "bot" && latest.animated) {
      const fullText = latest.text;
      const interval = setInterval(() => {
        setTypingIndex((prev) => {
          const next = prev + 1;
          if (next <= fullText.length) {
            setCurrentTypingText(fullText.slice(0, next));
          } else {
            clearInterval(interval);
            setIsTyping(false);
            setMessages((prev) => {
              const updated = [...prev];
              updated[updated.length - 1] = { from: "bot", text: fullText };
              return updated;
            });
          }
          return next;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [messages]);

  // Auto-scroll
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages, currentTypingText]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="w-80 h-96 bg-white rounded-xl shadow-xl flex flex-col overflow-hidden border border-gray-300"
          >
            {/* Header */}
            <div className="bg-indigo-600 text-white px-4 py-2 flex items-center justify-between">
              <h2 className="font-semibold">AI Assistant</h2>
              <button onClick={toggleChat}>
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={chatContainerRef}
              className="flex-1 p-3 overflow-y-auto bg-gray-50"
            >
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`my-2 flex ${
                    msg.from === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] text-sm ${
                      msg.from === "user"
                        ? "bg-indigo-100 text-indigo-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {msg.from === "bot" && msg.animated
                      ? currentTypingText
                      : msg.text}
                    {msg.from === "bot" && msg.animated && (
                      <span className="animate-blink ml-1">|</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="p-2 border-t border-gray-200 flex items-center">
              <input
                type="text"
                placeholder="Type your message..."
                className="flex-1 p-2 rounded-md border border-gray-300 text-sm focus:outline-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={isTyping}
              />
              <button
                onClick={handleSend}
                disabled={isTyping}
                className={`ml-2 p-2 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 transition ${
                  isTyping ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <SendHorizonal size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      {!isOpen && (
        <motion.button
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          className="p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition"
        >
          <MessageSquare className="w-5 h-5" />
        </motion.button>
      )}
    </div>
  );
}

// Blinking cursor animation
const style = document.createElement("style");
style.innerHTML = `
  .animate-blink {
    animation: blink 1s step-start 0s infinite;
  }
  @keyframes blink {
    50% { opacity: 0; }
  }
`;
document.head.appendChild(style);
