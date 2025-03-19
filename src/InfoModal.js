function InfoModal({ onClose }) {
  return (
    <div className="locked-modal">
      <h2 className="locked-modal-header">How It Works</h2>

      <p className="locked-modal-instruction">
        You score 1 point for every correct answer in a quiz
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

export default InfoModal;
