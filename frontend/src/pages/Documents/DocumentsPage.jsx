// src/pages/Documents/DocumentsPage.jsx
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './DocumentsPage.css';
import {
  DocumentUploader,
  DocumentList,
  DocumentViewer,
  DocumentMetadata,
} from '../../components';
import apiClient from '@/services/api/apiClient';
import { ENDPOINTS } from '@/services/api/endpoints';
import { getCurrentUser } from 'aws-amplify/auth';
import { getDocAnalysis } from '@/services/documents/documentAnalysisService';

const DocumentsPage = () => {
  const [documents, setDocuments] = useState([]);
  const [cases, setCases] = useState([]);
  const [selected, setSelected] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState('Unknown');
  const [fetchingAI, setFetchingAI] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showAIAnalysis, setShowAIAnalysis] = useState(false);

  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const selectedCaseId = params.get('caseId');

  // ✅ Fetch signed-in user email
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getCurrentUser();
        setUserEmail(user?.signInDetails?.loginId || user?.username || 'Unknown');
      } catch {
        setUserEmail('Unknown');
      }
    };
    fetchUser();
  }, []);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(ENDPOINTS.DOCUMENTS.BASE);
      setDocuments(response.data.items || []);
    } catch (error) {
      console.error('❌ Failed to fetch documents:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCases = async () => {
    try {
      const res = await apiClient.get(ENDPOINTS.CASES.BASE);
      setCases(res.data.items || []);
    } catch (err) {
      console.error('❌ Failed to fetch cases:', err);
    }
  };

  useEffect(() => {
    fetchDocuments();
    fetchCases();
  }, []);

  const handleUploadComplete = async () => {
    await fetchDocuments();
  };

  const documentsWithCaseTitles = documents.map((doc) => {
    const relatedCase = cases.find((c) => c.id === doc.caseId);
    return {
      ...doc,
      caseTitle: relatedCase ? relatedCase.title : 'Unlinked',
    };
  });

  // ✅ Filter by case if URL param exists
  const filteredDocs = selectedCaseId
    ? documentsWithCaseTitles.filter((doc) => doc.caseId === selectedCaseId)
    : documentsWithCaseTitles;

  const normalizeMeta = (doc) => {
    if (!doc) return null;
    return {
      name: doc.fileName || doc.name || doc.title || 'Untitled Document',
      type:
        doc.type ||
        doc.fileType ||
        (doc.fileName ? doc.fileName.split('.').pop().toUpperCase() : '') ||
        'UNKNOWN',
      createdAt: doc.uploadedAt || doc.createdAt || null,
      owner: userEmail || 'Unknown',
      caseTitle: doc.caseTitle || 'Unlinked',
    };
  };

  // ✅ Handle document preview
  const handlePreviewDocument = (doc) => {
    setSelected(doc);
    setShowPreview(true);
    setShowAIAnalysis(false);
    setAiResult(null);
  };

  // ✅ Fetch AI analysis result from DynamoDB
  const handleViewAIAnalysis = async (doc) => {
    setSelected(doc);
    setShowPreview(false);
    setShowAIAnalysis(true);
    setAiResult(null);
    setFetchingAI(true);
    try {
      const res = await getDocAnalysis(doc.documentId);
      if (res?.analysis) {
        const parsed = parseAIResponse(res.analysis);
        setAiResult(parsed);
      } else {
        setAiResult({ summary: 'No AI analysis available yet.' });
      }
    } catch (err) {
      console.error('❌ Failed to load AI analysis:', err);
      setAiResult({ summary: 'Error fetching AI analysis.' });
    } finally {
      setFetchingAI(false);
    }
  };

  // ✅ Helper: Parse AI JSON (like from Bedrock)
  const parseAIResponse = (analysis) => {
    try {
      if (analysis.summary) return analysis;

      if (
        analysis.content &&
        Array.isArray(analysis.content) &&
        analysis.content[0]?.text
      ) {
        const innerText = analysis.content[0].text;
        try {
          return JSON.parse(innerText);
        } catch {
          return { summary: innerText };
        }
      }
    } catch (err) {
      console.error('⚠️ Failed to parse AI JSON:', err);
    }
    return { summary: 'No summary generated.' };
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return '📄';
      case 'doc':
      case 'docx':
        return '📝';
      case 'xls':
      case 'xlsx':
        return '📊';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return '🖼️';
      default:
        return '📎';
    }
  };

  return (
    <div className="documents-page">
      <div className="page-header">
        <h2>
          Documents {selectedCaseId && <span className="filter-badge">Filtered by Case</span>}
        </h2>
      </div>

      <div className="upload-section">
        <DocumentUploader onUploadSuccess={handleUploadComplete} />
      </div>

      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading documents...</p>
        </div>
      ) : filteredDocs.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📁</div>
          <h3>No documents uploaded yet</h3>
          <p>Upload your first document to get started</p>
        </div>
      ) : (
        <div className="documents-container">
          <div className="documents-grid">
            {filteredDocs.map((doc) => (
              <div
                key={doc.documentId}
                className={`enhanced-doc-card ${
                  selected?.documentId === doc.documentId ? 'selected' : ''
                }`}
              >
                <div className="doc-card-header">
                  <span className="file-icon">{getFileIcon(doc.fileName)}</span>
                  <div className="doc-title-section">
                    <h4 className="doc-title">{doc.fileName}</h4>
                    <span className="case-badge">
                      <span className="badge-icon">📁</span>
                      {doc.caseTitle}
                    </span>
                  </div>
                </div>

                <div className="doc-card-actions">
                  <button
                    className="action-btn preview-btn"
                    onClick={() => handlePreviewDocument(doc)}
                    title="Preview Document"
                  >
                    <span className="btn-icon">👁️</span>
                    Preview
                  </button>
                  <button
                    className="action-btn ai-btn"
                    onClick={() => handleViewAIAnalysis(doc)}
                    title="View AI Analysis"
                  >
                    <span className="btn-icon">🤖</span>
                    AI Analysis
                  </button>
                </div>
              </div>
            ))}
          </div>

          {selected && (
            <div className="details-panel">
              {showPreview && (
                <div className="panel-content">
                  <div className="panel-header">
                    <h3>📄 Document Preview</h3>
                    <button
                      className="close-btn"
                      onClick={() => {
                        setSelected(null);
                        setShowPreview(false);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                  <div className="preview-container">
                    <DocumentViewer doc={selected} />
                  </div>
                  <div className="metadata-section">
                    <h4>Metadata</h4>
                    <DocumentMetadata meta={normalizeMeta(selected)} />
                  </div>
                </div>
              )}

              {showAIAnalysis && (
                <div className="panel-content">
                  <div className="panel-header">
                    <h3>🤖 AI Analysis</h3>
                    <button
                      className="close-btn"
                      onClick={() => {
                        setSelected(null);
                        setShowAIAnalysis(false);
                      }}
                    >
                      ✕
                    </button>
                  </div>

                  <div className="ai-analysis-container">
                    {fetchingAI ? (
                      <div className="loading-analysis">
                        <div className="spinner"></div>
                        <p>Analyzing document...</p>
                      </div>
                    ) : aiResult ? (
                      <div className="ai-result">
                        {aiResult.summary && (
                          <div className="analysis-block summary-block">
                            <h5>📋 Summary</h5>
                            <p>{aiResult.summary}</p>
                          </div>
                        )}

                        {aiResult.keyPoints && aiResult.keyPoints.length > 0 && (
                          <div className="analysis-block">
                            <h5>🔑 Key Points</h5>
                            <ul className="points-list">
                              {aiResult.keyPoints.map((p, i) => (
                                <li key={i}>{p}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiResult.risks && aiResult.risks.length > 0 && (
                          <div className="analysis-block risks-block">
                            <h5>⚠️ Risks</h5>
                            <ul className="points-list">
                              {aiResult.risks.map((r, i) => (
                                <li key={i}>{r}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {aiResult.entities && aiResult.entities.length > 0 && (
                          <div className="analysis-block">
                            <h5>🏢 Entities</h5>
                            <div className="entities-tags">
                              {aiResult.entities.map((e, i) => (
                                <span key={i} className="entity-tag">
                                  {e}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {aiResult.credibility && (
                          <div className="analysis-block credibility-block">
                            <h5>✅ Credibility Score</h5>
                            <div className="credibility-score">
                              <div className="score-bar">
                                <div
                                  className="score-fill"
                                  style={{ width: `${aiResult.credibility}%` }}
                                ></div>
                              </div>
                              <span className="score-text">
                                {aiResult.credibility}/100
                              </span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="empty-analysis">
                        <p>No AI analysis available for this document.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DocumentsPage;