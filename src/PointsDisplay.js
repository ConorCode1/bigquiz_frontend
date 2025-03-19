import React from "react";

const PointsDisplay = ({ score }) => {
  return (
    <div className="points-display">
      <div className="score-text">Score</div>
      <div className="score-value">{Math.round(score)}</div>
    </div>
  );
};

export default React.memo(PointsDisplay);
