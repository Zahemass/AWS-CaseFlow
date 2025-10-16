import React from 'react'
import './DocumentsPage.css'

const DocumentsPage = () => {
  const documents = [
    { id: 1, title: 'Case Evidence #1', description: 'Uploaded on 12 Oct 2025' },
    { id: 2, title: 'Witness Report', description: 'Uploaded on 10 Oct 2025' },
    { id: 3, title: 'Court Notice', description: 'Uploaded on 8 Oct 2025' },
  ]

  return (
    <div className="documents-page">
      <h2>Documents</h2>
      <p>Upload, manage, and view all case-related files securely.</p>

      <div className="upload-section">
        <p>Drag & drop files or click to upload new documents.</p>
        <button>Upload Document</button>
      </div>

      {documents.length > 0 ? (
        <div className="documents-grid">
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <h3>{doc.title}</h3>
              <p>{doc.description}</p>
              <button>View</button>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-documents">
          <p>No documents uploaded yet.</p>
        </div>
      )}
    </div>
  )
}

export default DocumentsPage
