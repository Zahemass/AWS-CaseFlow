import React, { useState } from "react";

const CitationPopover = ({ citation }) => {
  const [show, setShow] = useState(false);

  return (
    <div
      className="citation"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span className="citation-ref">[{citation.id}]</span>
      {show && <div className="citation-popover">{citation.text}</div>}
    </div>
  );
};

export default CitationPopover;
