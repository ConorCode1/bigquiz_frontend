import React from "react";
import { Button, Modal } from "react-bootstrap";

const FeedbackModal = ({
  showModal,
  onHide,
  lastAnswerCorrect,
  modalMessage,
  currentQuestion,
  onNext,
  isLastQuestion,
}) => {
  return (
    <Modal
      // className="my-modal-slide-up"
      show={showModal}
      onHide={onHide}
      dialogClassName="my-modal"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="my-modal-header justify-content-center">
        {lastAnswerCorrect ? (
          <>
            <i className="bi bi-check-circle-fill my-modal-icon modal-right-colour"></i>
            <div className="my-modal-message">{modalMessage}</div>
          </>
        ) : (
          <>
            <i className="bi bi-x-circle-fill my-modal-icon modal-wrong-colour"></i>
            <div className="my-modal-message">{modalMessage}</div>
          </>
        )}
      </Modal.Header>

      <Modal.Body className="my-modal-body">
        {currentQuestion ? (
          <>
            {!lastAnswerCorrect && (
              <div
                className="correct-answer-box"
                style={{ textAlign: "center" }}
              >
                Correct Answer:
                <br />
                <strong>{currentQuestion.correct_answer}</strong>
              </div>
            )}
            <br />
            <p>{currentQuestion.explanation}</p>
          </>
        ) : null}
      </Modal.Body>

      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <Button
          variant="secondary"
          onClick={onNext}
          className="modal-continue-button"
        >
          {isLastQuestion ? "Finish" : "Next"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FeedbackModal;
