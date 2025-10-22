import React from 'react';
import EvidenceNode from './EvidenceNode';

const EvidenceGraph = ({ nodes = [] }) => {
  if (!nodes || nodes.length === 0) {
    return (
      <div className="graph">
        <div className="graph-empty">
          <span className="empty-icon">🔍</span>
          <p>No evidence nodes to display.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="graph">
      <div className="graph-container">
        {nodes.map((node, index) => {
          const nodeData = typeof node === 'string' 
            ? { label: node, type: 'primary' }
            : { 
                label: node.label || node.name || `Node ${index + 1}`, 
                type: node.type || 'primary' 
              };
          
          return (
            <React.Fragment key={index}>
              <EvidenceNode node={nodeData} index={index} />
              {index < nodes.length - 1 && (
                <div className="node-connector">
                  <div className="connector-line"></div>
                  <div className="connector-arrow">→</div>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

export default EvidenceGraph;