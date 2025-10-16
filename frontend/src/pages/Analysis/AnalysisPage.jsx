import React from 'react'
import './AnalysisPage.css'

const AnalysisPage = () => {
  return (
    <div className="analysis-page">
      <h2>AI Case Analysis</h2>
      <p>Explore automated insights, contradictions, and credibility metrics for your case documents.</p>

      <div className="analysis-container">
        <div className="analysis-card">
          <h3>Contradiction Detector</h3>
          <p>Automatically detect conflicting statements across case documents.</p>
        </div>

        <div className="analysis-card">
          <h3>Timeline Builder</h3>
          <p>Generate chronological timelines for case events and key facts.</p>
        </div>

        <div className="analysis-card">
          <h3>Credibility Analyzer</h3>
          <p>Assess the reliability of evidence and witness statements using AI models.</p>
        </div>
      </div>

      <button>Run Full Analysis</button>
    </div>
  )
}

export default AnalysisPage
