import React, { useState } from "react";
import "./AgentSelector.css";

const AgentSelector = () => {
  const [selectedAgent, setSelectedAgent] = useState("Gemini");

  return (
    <div className="agent-selector">
      <label>Our AI Agent: Bedrock agent</label>
      
    </div>
  );
};

export default AgentSelector;
