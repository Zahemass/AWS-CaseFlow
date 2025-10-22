// src/pages/Agent/AgentPage.jsx
import React from "react";
import { useLocation, useSearchParams } from "react-router-dom";
import AgentChat from "../../components/Agent/AgentChat/AgentChat";
import AgentSelector from "../../components/Agent/AgentSelector/AgentSelector";
import "./AgentPage.css";

const AgentPage = () => {
  const [params] = useSearchParams();
  const location = useLocation();
  const caseId = params.get("caseId");
  const analysisData = location.state?.analysisData || null;

  if (!caseId) {
    return (
      <div className="agent-page no-case">
        <div className="agent-empty">
          <div className="agent-empty-card">
            <h1 className="agent-title">⚠️ No Case Selected</h1>
            <p className="agent-subtitle">
              Please open a case analysis first, then click the Farbot icon to chat.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="agent-page">
      <div className="agent-container">
        <div className="agent-header-fixed">
          <h1 className="agent-title">AI Legal Assistant 🤖</h1>
          <p className="agent-subtitle">
            Ask questions about your case ({caseId}) — Farbot will analyze the uploaded documents to answer intelligently.
          </p>
          <AgentSelector caseId={caseId} />
        </div>

        <div className="agent-chat-wrapper">
          {/* Pass analysisData here */}
          <AgentChat caseId={caseId} analysisData={analysisData} />
        </div>
      </div>
    </div>
  );
};

export default AgentPage;
