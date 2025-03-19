function LockModal({ onClose }) {
  return (
    <div className="locked-modal">
      <h2 className="locked-modal-header">Time Rush is Locked</h2>

      <p className="locked-modal-instruction">
        Get at least 1 star in all of the quizzes in this section to unlock
      </p>

      <button
        className="locked-modal-close-btn"
        onClick={() => {
          onClose();
        }}
      >
        Close
      </button>
    </div>
  );
}

export default LockModal;
