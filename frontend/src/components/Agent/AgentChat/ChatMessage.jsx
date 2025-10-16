import React from "react";
import "./AgentChat.css";

const ChatMessage = ({ sender, text }) => {
  const isUser = sender === "user";
  return (
    <div className={`chat-message ${isUser ? "user" : "agent"}`}>
      <div className="message-bubble">{text}</div>
    </div>
  );
};

export default ChatMessage;
