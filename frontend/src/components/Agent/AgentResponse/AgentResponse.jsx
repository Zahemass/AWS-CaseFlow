import React from "react";
import "./AgentResponse.css";
import CitationPopover from "./CitationPopover";

const AgentResponse = ({ text, citations = [] }) => {
  return (
    <div className="agent-response">
      <p>{text}</p>
      {citations.length > 0 && (
        <div className="citations">
          {citations.map((c, i) => (
            <CitationPopover key={i} citation={c} />
          ))}
        </div>
      )}
    </div>
  );
};

export default AgentResponse;