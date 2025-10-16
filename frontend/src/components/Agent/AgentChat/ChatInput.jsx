import React, { useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import "./AgentChat.css";

const ChatInput = ({ onSend }) => {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSend(text);
    setText("");
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message..."
      />
      <button type="submit" title="Send">
        <FaPaperPlane />
      </button>
    </form>
  );
};

export default ChatInput;
