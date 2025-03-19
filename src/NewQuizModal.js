import React from "react";
import { Button, Modal } from "react-bootstrap";
import scissors from "./Images/scissors.png";
import time from "./Images/time.png";

const NewQuizModal = ({
  showModal,
  onHide,
  lastAnswerCorrect,
  modalMessage,
  currentQuestion,
  onNext,
  isLastQuestion,
  timeExpired,
}) => {
  let headerContent;

  if (timeExpired) {
    headerContent = null;
  } else if (lastAnswerCorrect) {
    if (currentQuestion?.is_multiple_choice) {
      headerContent = (
        <div className="time-content">
          <img src={time} alt="Scissors" className="scissors-icon" />
          <div>+5</div>
          <div className="seconds-text">seconds</div>
        </div>
      );
    } else {
      headerContent = (
        <div className="time-content">
          <img src={time} alt="Scissors" className="scissors-icon" />
          <div>+8</div>
          <div className="seconds-text">seconds</div>
        </div>
      );
    }
  } else {
    headerContent = (
      <>
        <img src={scissors} alt="Scissors" className="scissors-icon" />
        <div className="seconds-modal">Time Cut!</div>
      </>
    );
  }

  return (
    <Modal
      show={showModal}
      onHide={onHide}
      dialogClassName="my-modal"
      centered
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header className="my-modal-header justify-content-center">
        {typeof headerContent === "string" ? (
          <div className="seconds-modal">{headerContent}</div>
        ) : (
          headerContent
        )}
        <div className="my-modal-message">{modalMessage}</div>
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
          {timeExpired ? "Finish" : isLastQuestion ? "Finish" : "Next"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NewQuizModal;
