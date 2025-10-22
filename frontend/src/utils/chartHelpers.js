// Format case stats for chart.js or recharts
export const formatCaseStats = (cases = []) => {
  const open = cases.filter((c) => c.status === 'Open').length;
  const closed = cases.filter((c) => c.status === 'Closed').length;
  const pending = cases.filter((c) => c.status === 'Pending').length;
  return [
    { name: 'Open', value: open },
    { name: 'Closed', value: closed },
    { name: 'Pending', value: pending },
  ];
};

// Prepare timeline events for chart rendering
export const formatTimelineData = (events = []) =>
  events.map((e) => ({
    id: e.id,
    title: e.title,
    date: new Date(e.date).toISOString().split('T')[0],
  }));

// Convert credibility scores to chart format
export const formatCredibilityScores = (scores = {}) =>
  Object.keys(scores).map((key) => ({
    label: key,
    score: scores[key],
  }));

// Normalize evidence chain data
export const normalizeEvidenceData = (evidence = []) =>
  evidence.map((item, idx) => ({
    id: idx + 1,
    name: item.source,
    link: item.reference,
  }));
