import React, { useState } from "react";
import "./AgentSelector.css";

const AgentSelector = () => {
  const [selectedAgent, setSelectedAgent] = useState("Gemini");

  return (
    <div className="agent-selector">
      <label>Active AI Agent:</label>
      <select
        value={selectedAgent}
        onChange={(e) => setSelectedAgent(e.target.value)}
      >
        <option value="Gemini">Gemini AI</option>
        <option value="Claude">Claude</option>
        <option value="Bedrock">AWS Bedrock</option>
      </select>
    </div>
  );
};

export default AgentSelector;
