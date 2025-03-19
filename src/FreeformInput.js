import React from "react";
import { Container, Button } from "react-bootstrap";

const FreeformInput = ({ value, onChange, onSubmit }) => {
  return (
    <Container className="freeform-container">
      <textarea
        className="freeform-input"
        placeholder="Type your answer here..."
        onChange={onChange}
        value={value}
      />
      <Button className="submit-freeform-answer-btn" onClick={onSubmit}>
        Check Answer
      </Button>
    </Container>
  );
};

export default FreeformInput;
