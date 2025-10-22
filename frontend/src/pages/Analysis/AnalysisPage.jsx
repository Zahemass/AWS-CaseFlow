import React, { useEffect, useState } from 'react';
import './AnalysisPage.css';
import {
  ContradictionDetector,
  CredibilityAnalyzer,
  EvidenceChain,
  TimelineBuilder,
} from '../../components';
import { useSearchParams, useNavigate } from 'react-router-dom';
import apiClient from '@/services/api/apiClient';
import { ENDPOINTS } from '@/services/api/endpoints';
import {
  FaRobot,
  FaChevronDown,
  FaChevronUp,
  FaExclamationTriangle,
  FaCheckCircle,
  FaUsers,
  FaGavel,
} from 'react-icons/fa';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";


const CollapsiblePanel = ({ title, children, icon: Icon, defaultOpen = true }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className={`collapsible-panel ${isOpen ? 'open' : ''}`}>
      <div className="panel-header" onClick={() => setIsOpen(!isOpen)}>
        <div className="panel-title">
          {Icon && <Icon className="panel-icon" />}
          <h3>{title}</h3>
        </div>
        {isOpen ? <FaChevronUp className="toggle-icon" /> : <FaChevronDown className="toggle-icon" />}
      </div>
      {isOpen && <div className="panel-content">{children}</div>}
    </div>
  );
};

const InfoCard = ({ title, children, icon: Icon, variant = 'default' }) => (
  <div className={`info-card ${variant}`}>
    {Icon && (
      <div className="card-icon-wrapper">
        <Icon className="card-icon" />
      </div>
    )}
    <div className="card-content">
      <h4>{title}</h4>
      {children}
    </div>
  </div>
);

const TagList = ({ tags = [] }) => (
  <div className="tag-list">
    {tags.map((tag, i) => (
      <span key={i} className="tag-item">{tag}</span>
    ))}
  </div>
);

const KeyPoint = ({ point, index }) => (
  <div className="key-point">
    <span className="point-number">{index + 1}</span>
    <p>{typeof point === 'string' ? point : JSON.stringify(point)}</p>
  </div>
);

// 🧩 1️⃣ Function to create the PDF in memory (no download)
const generatePDFBuffer = (analysis, caseId) => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  let y = margin;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AI Case Analysis Report', margin, y);
  y += 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Case ID: ${caseId}`, margin, y);
  y += 20;

  doc.setFont('helvetica', 'bold');
  doc.text('Case Summary', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  const wrappedSummary = doc.splitTextToSize(analysis.caseSummary || 'No summary available.', 500);
  doc.text(wrappedSummary, margin, y);
  y += wrappedSummary.length * 14 + 10;

  if (analysis.combinedKeyPoints?.length) {
    doc.setFont('helvetica', 'bold');
    doc.text('Key Findings', margin, y);
    y += 10;
    autoTable(doc, {
      startY: y,
      head: [['#', 'Finding']],
      body: analysis.combinedKeyPoints.map((p, i) => [
        i + 1,
        typeof p === 'string' ? p : JSON.stringify(p),
      ]),
      margin: { left: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, halign: 'center' },
    });
    y = doc.lastAutoTable.finalY + 20;
  }

  if (analysis.finalConclusion) {
    doc.setFont('helvetica', 'bold');
    doc.text('Final Conclusion', margin, y);
    y += 14;
    doc.setFont('helvetica', 'normal');
    const wrappedConclusion = doc.splitTextToSize(analysis.finalConclusion, 500);
    doc.text(wrappedConclusion, margin, y);
  }

  return doc.output('blob');
};

// 🧩 2️⃣ Function to upload silently to S3 (no download)
const uploadPDFToS3 = async (pdfBlob, caseId) => {
  try {
    console.log("🚀 Uploading PDF to S3 silently...");

    const pdfBuffer = await pdfBlob.arrayBuffer();
    const s3 = new S3Client({
      region: import.meta.env.VITE_AWS_REGION,
      credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY,
      },
    });

    const uploadParams = {
      Bucket: import.meta.env.VITE_AWS_S3_PDF_BUCKET,
      Key: `Case_${caseId}_Analysis.pdf`,
      Body: pdfBuffer,
      ContentType: 'application/pdf',
    };

    await s3.send(new PutObjectCommand(uploadParams));
    console.log("✅ Silent PDF upload complete — Lambda will trigger email.");
  } catch (error) {
    console.error("❌ Error uploading to S3:", error);
  }
};

const AnalysisPage = () => {
  const [params] = useSearchParams();
  const caseId = params.get('caseId');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);
  const navigate = useNavigate();

  const exportToPDF = async (data = analysis) => {
  if (!data) return;
      const analysis = data; 
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  const margin = 40;
  let y = margin;

  // === Header ===
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text('AI Case Analysis Report', margin, y);
  y += 20;

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Case ID: ${caseId}`, margin, y);
  y += 20;

  // === Section: Case Summary ===
  doc.setFont('helvetica', 'bold');
  doc.text('Case Summary', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  const caseSummary = analysis.caseSummary || 'No summary available.';
  const wrappedSummary = doc.splitTextToSize(caseSummary, 500);
  doc.text(wrappedSummary, margin, y);
  y += wrappedSummary.length * 14 + 10;

  // === Section: Key Findings ===
  if (analysis.combinedKeyPoints?.length) {
    doc.setFont('helvetica', 'bold');
    doc.text('Key Findings', margin, y);
    y += 10;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Finding']],
      body: analysis.combinedKeyPoints.map((p, i) => [
        i + 1,
        typeof p === 'string' ? p : JSON.stringify(p),
      ]),
      margin: { left: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, halign: 'center' },
    });

    y = doc.lastAutoTable.finalY + 20;
  }

  // === Section: Identified Risks ===
  if (analysis.overallRisks?.length) {
    doc.setFont('helvetica', 'bold');
    doc.text('Identified Risks', margin, y);
    y += 10;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Risk']],
      body: analysis.overallRisks.map((r, i) => [
        i + 1,
        typeof r === 'string' ? r : JSON.stringify(r),
      ]),
      margin: { left: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, halign: 'center' },
    });

    y = doc.lastAutoTable.finalY + 20;
  }

  // === Section: Entities Involved ===
  if (analysis.entitiesInvolved?.length) {
    doc.setFont('helvetica', 'bold');
    doc.text('Entities Involved', margin, y);
    y += 10;

    autoTable(doc, {
      startY: y,
      head: [['Entity']],
      body: analysis.entitiesInvolved.map((e) => [e]),
      margin: { left: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, halign: 'center' },
    });

    y = doc.lastAutoTable.finalY + 20;
  }

  // === Section: Contradictions ===
  if (analysis.contradictions?.length) {
    doc.setFont('helvetica', 'bold');
    doc.text('Contradictions Detected', margin, y);
    y += 10;

    autoTable(doc, {
      startY: y,
      head: [['#', 'Contradiction']],
      body: analysis.contradictions.map((c, i) => [
        i + 1,
        typeof c === 'string' ? c : JSON.stringify(c),
      ]),
      margin: { left: margin },
      styles: { fontSize: 10, cellPadding: 4 },
      headStyles: { fillColor: [0, 102, 204], textColor: 255, halign: 'center' },
    });

    y = doc.lastAutoTable.finalY + 20;
  }

  // === Section: Final Conclusion ===
  doc.setFont('helvetica', 'bold');
  doc.text('Final Conclusion', margin, y);
  y += 14;

  doc.setFont('helvetica', 'normal');
  const finalConclusion = analysis.finalConclusion || 'No conclusion available.';
  const wrappedConclusion = doc.splitTextToSize(finalConclusion, 500);
  doc.text(wrappedConclusion, margin, y);
  y += wrappedConclusion.length * 14 + 10;

  // === Footer ===
  doc.setFontSize(10);
  doc.setTextColor(100);
  const footerText = `Generated on: ${new Date().toLocaleString()}`;
  doc.text(footerText, margin, 820);

  // === Save PDF ===
  doc.save(`Case_${caseId}_Analysis.pdf`);

};

  // ✅ Step 1: Trigger Bedrock analysis first, then fetch result
  useEffect(() => {
    let hasRun = false;
    const runAnalysis = async () => {
      if (!caseId) return;
       if (hasRun) return; 
       hasRun = true;

      try {
        setLoading(true);
        setErr(null);

        console.log(`🚀 Running case-level AI analysis for caseId=${caseId}`);

        // 1️⃣ Trigger Bedrock AI case analysis Lambda (POST /analysis)
        const postRes = await apiClient.post(ENDPOINTS.ANALYSIS.CREDIBILITY, { caseId });
        console.log('✅ POST /analysis response:', postRes.data);

        // 2️⃣ After success, fetch from DynamoDB (GET /analysis)
        const getRes = await apiClient.get(`${ENDPOINTS.ANALYSIS.GET}?caseId=${caseId}`);
        console.log('✅ GET /analysis response:', getRes.data);

        let aiData = getRes.data.finalAnalysis;

        // Handle nested Bedrock content if needed
        if (aiData?.content && Array.isArray(aiData.content)) {
          const text = aiData.content[0]?.text;
          try {
            aiData = JSON.parse(text);
          } catch {
            console.warn('⚠️ Failed to parse nested JSON from content.text');
          }
        }

        console.log('📊 Final analysis data:', aiData);
        setAnalysis(aiData);
        // 🧠 Auto-generate PDF and upload to S3 if new analysis
if (postRes.data.message !== "No new documents found. Returning saved analysis.") {
        console.log("🪶 New analysis detected — auto-uploading to S3...");
        const pdfBlob = generatePDFBuffer(aiData, caseId);
        await uploadPDFToS3(pdfBlob, caseId);
      } else {
        console.log("⚡ Skipping upload — using cached analysis.");
      }
    } catch (e) {
      console.error('❌ Error running analysis:', e);
      setErr('Failed to run or fetch analysis.');
    } finally {
      setLoading(false);
    }
  };

    runAnalysis();
  }, [caseId]);

  // 🧱 UI States
  if (!caseId) {
    return (
      <div className="analysis-page">
        <div className="empty-state">
          <FaGavel className="empty-icon" />
          <h3>No Case Selected</h3>
          <p>Please select a case from the sidebar to view its analysis.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="analysis-page">
        <div className="loading-state">
          <div className="loader"></div>
          <p>Analyzing case {caseId} using AI...</p>
          <p className="hint-text">Please wait while we process and save the results.</p>
        </div>
      </div>
    );
  }

  if (err) {
    return (
      <div className="analysis-page">
        <div className="error-state">
          <FaExclamationTriangle className="error-icon" />
          <h3>Error Running Analysis</h3>
          <p>{err}</p>
        </div>
      </div>
    );
  }

  if (!analysis) {
    return (
      <div className="analysis-page">
        <div className="empty-state">
          <FaGavel className="empty-icon" />
          <h3>No Analysis Available</h3>
          <p>No analysis data found for this case.</p>
        </div>
      </div>
    );
  }

  // ✅ Analysis Render
  const credibilityScore = analysis.averageCredibility || 0;

  // Build evidence chain from legal issues and key points
  const evidenceNodes = [
    ...(analysis.legalIssues || []).slice(0, 3).map(issue => ({
      label: issue,
      type: 'legal'
    })),
    ...(analysis.recommendedActions || []).slice(0, 2).map(action => ({
      label: action,
      type: 'action'
    }))
  ];

    



  return (
    <div className="analysis-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <FaGavel className="header-icon" />
          <div>
            <h1>AI Case Analysis Report</h1>
            <p className="case-id">Case ID: {caseId}</p>
          </div>
        </div>
      </div>

      <button className="export-btn" onClick={exportToPDF}>
  📄 Export PDF
</button>


      {/* Main Content */}
      <div className="content-wrapper">
        {/* Left Column */}
        <div className="left-column">
          <CollapsiblePanel title="Case Summary" icon={FaCheckCircle}>
            <p className="summary-text">{analysis.caseSummary || 'No summary available.'}</p>
          </CollapsiblePanel>

          <CollapsiblePanel title="Key Findings" icon={FaCheckCircle}>
            <div className="key-points-list">
              {!analysis.combinedKeyPoints?.length ? (
                <p className="muted-text">No key findings identified.</p>
              ) : (
                analysis.combinedKeyPoints.map((point, i) => (
                  <KeyPoint key={i} point={point} index={i} />
                ))
              )}
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Identified Risks" icon={FaExclamationTriangle}>
            <div className="risks-list">
              {!analysis.overallRisks?.length ? (
                <p className="muted-text">No risks identified.</p>
              ) : (
                analysis.overallRisks.map((risk, i) => (
                  <InfoCard key={i} variant="warning">
                    <p>{typeof risk === 'string' ? risk : JSON.stringify(risk)}</p>
                  </InfoCard>
                ))
              )}
            </div>
          </CollapsiblePanel>

          <CollapsiblePanel title="Entities Involved" icon={FaUsers}>
            {!analysis.entitiesInvolved?.length ? (
              <p className="muted-text">No entities listed.</p>
            ) : (
              <TagList tags={analysis.entitiesInvolved} />
            )}
          </CollapsiblePanel>

          <CollapsiblePanel title="Final Conclusion" icon={FaGavel} defaultOpen={true}>
            <div className="conclusion-box">
              <p>{analysis.finalConclusion || 'No conclusion available.'}</p>
            </div>
          </CollapsiblePanel>
        </div>

        {/* Right Column */}
        <div className="right-column">
          <div className="analysis-components">
            <CredibilityAnalyzer 
              score={(credibilityScore || 0) / 100} 
              claims={[]} 
            />
            
            {/* ✅ FIXED: Pass contradictions instead of overallRisks */}
            <ContradictionDetector 
              items={analysis.contradictions || []} 
            />
            
            {/* ✅ Timeline already correct */}
            <TimelineBuilder 
              events={analysis.timelineCriticalDates || []} 
            />
            
            {/* ✅ FIXED: Pass evidence nodes */}
            <EvidenceChain 
              nodes={evidenceNodes} 
            />
          </div>
        </div>
      </div>

      {/* Floating AI Assistant */}
      <button
        className="farbot-button"
        onClick={() => navigate(`/agent?caseId=${caseId}`, { state: { analysisData: analysis } })}
        title="Chat with FARBOT AI"
      >
        <FaRobot className="farbot-icon" />
        <span className="farbot-label">AI Assistant</span>
      </button>
    </div>
  );
};

export default AnalysisPage;