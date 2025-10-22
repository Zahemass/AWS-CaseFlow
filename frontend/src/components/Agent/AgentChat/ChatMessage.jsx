// ChatMessage.jsx
import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import "./ChatMessage.css";

const ChatMessage = ({ sender, text, actions = [], onActionClick, isUrgent = false }) => {
  const [typedText, setTypedText] = useState(sender === "agent" ? "" : text);
  const [isTypingComplete, setIsTypingComplete] = useState(sender !== "agent");

  // Smooth typing animation for agent messages
  useEffect(() => {
    if (sender === "agent" && text) {
      let i = 0;
      let current = "";
      const chars = [...text];
      const typingSpeed = 8; // Adjust for faster/slower typing

      const timer = setInterval(() => {
        if (i < chars.length) {
          current += chars[i];
          setTypedText(current);
          i++;
        } else {
          setIsTypingComplete(true);
          clearInterval(timer);
        }
      }, typingSpeed);

      return () => clearInterval(timer);
    }
  }, [text, sender]);

  return (
    <div className={`chat-message ${sender} ${isUrgent ? "urgent" : ""}`}>
      {/* Avatar */}
      <div className="message-avatar">
        {sender === "agent" ? "🤖" : "👤"}
      </div>

      {/* Message Bubble */}
      <div className={`message-bubble ${sender}`}>
        <div className="markdown-message">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {sender === "agent" ? typedText : text}
          </ReactMarkdown>

          {/* Typing Cursor */}
          {sender === "agent" && !isTypingComplete && (
            <span className="typewriter-cursor" />
          )}
        </div>

        {/* Action Buttons */}
        {actions && actions.length > 0 && isTypingComplete && (
          <div className="message-actions">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={() => onActionClick(action.action)}
                className={`action-button ${action.variant || "default"}`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
