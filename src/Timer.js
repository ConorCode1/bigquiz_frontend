import React, { useEffect } from "react";

const ProgressBarTimer = ({
  timeLeft,
  originalTime,
  onComplete,
  onTimeUpdate,
  isModalOpen, // Accept the new prop
}) => {
  const calculateProgress = () => (timeLeft / originalTime) * 100;

  const progress = calculateProgress();

  const barColor = progress > 40 ? "green" : progress > 15 ? "orange" : "red";

  useEffect(() => {
    // Only update progress when modal is not open
    if (!isModalOpen) {
      const remainingTime = Math.max(timeLeft, 0);
      onTimeUpdate && onTimeUpdate(remainingTime);

      if (remainingTime <= 0) {
        onComplete && onComplete();
      }
    }
  }, [timeLeft, onComplete, onTimeUpdate, originalTime, isModalOpen]);

  return (
    <div className="timer-bar-wrapper">
      <div className="timer-bar-container">
        <div
          className="timer-bar__fill"
          style={{
            width: `${progress}%`,
            backgroundColor: barColor,
          }}
        ></div>
      </div>
      <div className="stopwatch-wrapper">
        <i className="bi bi-stopwatch stopwatch-icon"></i>
        <div className="timer-bar__text">
          {Number.isNaN(timeLeft) ? "Error" : Math.ceil(timeLeft)}
        </div>
      </div>
    </div>
  );
};

export default ProgressBarTimer;
