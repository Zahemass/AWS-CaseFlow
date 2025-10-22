// TypingIndicator.jsx
import React, { useState, useEffect } from "react";
import "./TypingIndicator.css";

const loadingTexts = [
  "🤖 Our Bedrock Agent is analysing your response...",
  "🔍 Checking how many Bedrock agents are needed for coordination...",
  "🧠 Connecting Agent Coordinator...",
  "📊 Taking key strategic points into consideration...",
  "⚖️ Analysing the case to form a strong validation..."
];

const TypingIndicator = () => {
  const [currentTextIndex, setCurrentTextIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTextIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 2500); // change every 2.5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="typing-indicator enhanced">
      <p className="loading-text">{loadingTexts[currentTextIndex]}</p>
    </div>
  );
};

export default TypingIndicator;
