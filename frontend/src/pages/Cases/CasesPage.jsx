import React, { useState } from 'react'
import './CasesPage.css'

const CasesPage = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const cases = [
    { id: 1, title: 'State vs Johnson', status: 'Open', date: '12 Oct 2025' },
    { id: 2, title: 'Miller vs Green Corp.', status: 'Closed', date: '09 Oct 2025' },
    { id: 3, title: 'Adams vs Knight', status: 'In Progress', date: '05 Oct 2025' },
  ]

  const filteredCases = cases.filter((c) =>
    c.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="cases-page">
      <h2>Case Management</h2>
      <p>Manage, view, and track all ongoing and past cases efficiently.</p>

      <div className="case-actions">
        <input
          type="text"
          placeholder="Search by case title..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button>Create New Case</button>
      </div>

      {filteredCases.length > 0 ? (
        <div className="cases-grid">
          {filteredCases.map((item) => (
            <div key={item.id} className="case-card">
              <h3>{item.title}</h3>
              <p>Status: {item.status}</p>
              <p>Date: {item.date}</p>
              <button>View Details</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-cases">
          <p>No cases found. Try searching again.</p>
        </div>
      )}
    </div>
  )
}

export default CasesPage
