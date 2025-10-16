import React, { useState } from "react";
import "./AgentChat.css";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";
import TypingIndicator from "./TypingIndicator";

const AgentChat = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: "agent", text: "Hello Zaheer 👋 How can I assist with your case today?" },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    // Simulate AI response delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), sender: "agent", text: `I received: "${text}". Let me analyze that... 🤖` },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="agent-chat">
      <div className="chat-window">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
        ))}
        {isTyping && <TypingIndicator />}
      </div>

      <ChatInput onSend={handleSend} />
    </div>
  );
};

export default AgentChat;
