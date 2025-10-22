// src/components/Documents/DocumentUploader/DocumentUploader.jsx
import React, { useState, useEffect } from 'react';
import { uploadFile } from '@/services/documents/uploadService';
import { getDocAnalysis } from '@/services/documents/documentAnalysisService';
import UploadProgress from './UploadProgress';
import apiClient from '@/services/api/apiClient';
import { ENDPOINTS } from '@/services/api/endpoints';
import './DocumentUploader.css';

const DocumentUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [cases, setCases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedCase, setSelectedCase] = useState('');
  const [showSummary, setShowSummary] = useState(false);
  const [summaryText, setSummaryText] = useState('');

  // ✅ Fetch available cases from backend
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const response = await apiClient.get(ENDPOINTS.CASES.BASE);
        setCases(response.data.items || []);
      } catch (err) {
        console.error('❌ Failed to fetch cases:', err);
      }
    };
    fetchCases();
  }, []);

  // ✅ File select handler
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
  };

  // ✅ Open case selection modal
  const handleUploadClick = () => {
    if (!file) return setError('Please select a file first.');
    setShowModal(true);
  };

  // ✅ Upload confirmed file under selected case
  const handleConfirmUpload = async () => {
    if (!selectedCase) return setError('Please select a case.');

    setUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      // Upload to S3 + notify backend
      const uploaded = await uploadFile(file, 'uploads/', selectedCase);
      console.log('✅ Upload complete (S3 + DynamoDB):', uploaded);

      onUploadSuccess?.(uploaded);
      setFile(null);
      setSelectedCase('');
      setShowModal(false);
      setUploading(false);
      setUploadProgress(100);

      // ✅ Poll DynamoDB for AI analysis result
      const id = uploaded?.documentId || uploaded?.key || null;
      if (id) {
        console.log('🔍 Polling for AI analysis of', id);
        let tries = 0;
        const iv = setInterval(async () => {
          tries++;
          try {
            const item = await getDocAnalysis(id);
            if (item?.analysis) {
  let summaryText = 'No summary generated';

  try {
    // 🧩 Case 1: Normal structured JSON
    if (item.analysis.summary) {
      summaryText = item.analysis.summary;

    // 🧩 Case 2: Wrapped Bedrock response
    } else if (
      item.analysis.content &&
      Array.isArray(item.analysis.content) &&
      item.analysis.content[0]?.text
    ) {
      const innerText = item.analysis.content[0].text;

      try {
        const parsed = JSON.parse(innerText);
        summaryText = parsed.summary || innerText;
      } catch {
        summaryText = innerText;
      }
    }
  } catch (err) {
    console.warn('⚠️ Failed to parse AI summary:', err);
  }

  setSummaryText(summaryText);
  setShowSummary(true);
}

          } catch (e) {
            console.warn('Polling failed:', e);
          }
          if (tries > 20) {
            clearInterval(iv);
            console.warn('⌛ Analysis timeout');
          }
        }, 3000);
      }
    } catch (err) {
      console.error('❌ Upload failed:', err);
      setError('Upload failed. Please try again.');
      setUploading(false);
    }
  };

  return (
    <div className="document-uploader">
      <h3>Upload a Document</h3>

      <input
        type="file"
        accept=".pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
        disabled={uploading}
      />

      {uploading && <UploadProgress percent={uploadProgress} />}
      {error && <p className="error">{error}</p>}

      <button
        onClick={handleUploadClick}
        disabled={uploading || !file}
        className="upload-btn"
      >
        {uploading ? 'Uploading...' : 'Upload'}
      </button>

      {/* ✅ Case Selection Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h4>Select Case for Upload</h4>

            <select
              value={selectedCase}
              onChange={(e) => setSelectedCase(e.target.value)}
              className="case-dropdown"
            >
              <option value="">-- Select Case --</option>
              {cases.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <div className="modal-buttons">
              <button className="confirm-btn" onClick={handleConfirmUpload}>
                Confirm Upload
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowModal(false)}
                disabled={uploading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

     
    </div>
  );
};

export default DocumentUploader;
