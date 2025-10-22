import React, { useEffect, useState } from 'react';
import { getUrl } from 'aws-amplify/storage';
import './DocumentViewer.css';

/**
 * ✅ PDFViewer Component
 * - Fetches a signed URL from S3 via Amplify Storage
 * - Displays PDF inside an iframe
 */
const PDFViewer = ({ fileKey }) => {
  const [fileUrl, setFileUrl] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFile = async () => {
      if (!fileKey) {
        console.warn('⚠️ No file key provided to PDFViewer.');
        setError('File key missing.');
        return;
      }

      setLoading(true);
      try {
        console.log('📄 Fetching signed URL for key:', fileKey);

        // ✅ FIXED: Don't add "public/" manually. Amplify handles it.
        const { url } = await getUrl({
          key: fileKey,
          options: {
            accessLevel: 'public', // keep consistent with upload
            expiresIn: 3600, // 1 hour
          },
        });

        console.log('✅ Signed URL generated:', url);
        setFileUrl(url);
      } catch (err) {
        console.error('❌ Failed to load PDF from S3:', err);
        setError('Failed to load document. Please check S3 permissions.');
      } finally {
        setLoading(false);
      }
    };

    loadFile();
  }, [fileKey]);

  if (loading) return <p className="pdf-viewer-loading">Loading document...</p>;
  if (error) return <p className="pdf-viewer-error">{error}</p>;
  if (!fileUrl) return <p className="pdf-viewer-placeholder">No document to display.</p>;

  return (
    <div className="pdf-viewer-container">
      <iframe
        src={fileUrl}
        title="Document Preview"
        className="pdf-viewer-frame"
        frameBorder="0"
        allow="fullscreen"
      />
    </div>
  );
};

export default PDFViewer;
