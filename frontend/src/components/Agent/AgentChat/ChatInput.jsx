import React, { useState, useRef, useEffect } from "react";
import { FaPaperPlane, FaMicrophone } from "react-icons/fa";
import "./AgentChat.css";

const ChatInput = ({ onSend, disabled = false }) => {
  const [text, setText] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && !disabled) {
      onSend(text);
      setText("");
    }
  };

  const handleKeyPress = (e) => {
    // Send message on Enter, but allow Shift+Enter for new lines
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Auto-focus input when enabled
  useEffect(() => {
    if (!disabled && inputRef.current) {
      inputRef.current.focus();
    }
  }, [disabled]);

  return (
    <form 
      className={`chat-input ${isFocused ? 'focused' : ''}`} 
      onSubmit={handleSubmit}
    >
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyPress={handleKeyPress}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={disabled ? "AI is typing..." : "Type your message..."}
        disabled={disabled}
        className={disabled ? 'disabled' : ''}
      />
      
      <button 
        type="submit" 
        title="Send message"
        disabled={!text.trim() || disabled}
        className={text.trim() && !disabled ? 'active' : ''}
      >
        <FaPaperPlane />
        <span className="button-text">Send</span>
      </button>
    </form>
  );
};

export default ChatInput;