import React from "react";
import MainLayout from "../../components/Layout/MainLayout/MainLayout";
import AgentChat from "../../components/Agent/AgentChat/AgentChat";
import AgentSelector from "../../components/Agent/AgentSelector/AgentSelector";
import "./AgentPage.css";

const AgentPage = () => {
  return (
    <MainLayout>
      <div className="agent-page">
        <h1 className="agent-title">AI Legal Assistant 🤖</h1>
        <p className="agent-subtitle">
          Ask questions, summarize cases, or get insights powered by AI.
        </p>
        <AgentSelector />
        <AgentChat />
      </div>
    </MainLayout>
  );
};

export default AgentPage;
