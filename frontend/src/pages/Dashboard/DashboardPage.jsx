import React from 'react'
import './DashboardPage.css'

const DashboardPage = () => {
  const stats = [
    { id: 1, title: 'Active Cases', value: 24 },
    { id: 2, title: 'Documents Uploaded', value: 82 },
    { id: 3, title: 'AI Analyses Run', value: 15 },
    { id: 4, title: 'Pending Reviews', value: 7 },
  ]

  const activities = [
    'Uploaded “Case Evidence #1”',
    'Created new case “State vs Johnson”',
    'Ran credibility analysis',
    'Viewed timeline report',
  ]

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h2>Dashboard Overview</h2>
        <p>Monitor your case progress, AI insights, and document activities.</p>
      </div>

      <div className="dashboard-stats">
        {stats.map((item) => (
          <div key={item.id} className="stat-card">
            <h3>{item.title}</h3>
            <div className="value">{item.value}</div>
          </div>
        ))}
      </div>

      <div className="quick-actions">
        <button>Create New Case</button>
        <button>Upload Document</button>
        <button>Run AI Analysis</button>
      </div>

      <div className="recent-activity">
        <h3>Recent Activity</h3>
        <div className="activity-list">
          {activities.map((act, i) => (
            <div key={i} className="activity-item">
              <span>{act}</span>
              <span>🕒 Just now</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
