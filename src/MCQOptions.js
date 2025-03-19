import React, { useEffect, useState } from "react";
import { Row, Col, Button } from "react-bootstrap";

const MCQOptions = ({
  options,
  handleClick,
  clickedOption,
  correctAnswer,
  disabledOptions,
}) => {
  const [selectedOptionStyle, setSelectedOptionStyle] = useState({});

  useEffect(() => {
    // Determine the style based on the correctness of the answer
    const style =
      clickedOption === correctAnswer
        ? { backgroundColor: "green", borderColor: "darkgreen" }
        : { backgroundColor: "red", borderColor: "darkred" };

    // If an option has been clicked, set the style
    if (clickedOption) {
      setSelectedOptionStyle(style);
    }
  }, [clickedOption, correctAnswer]); // Dependencies of the effect

  return (
    <Row className="answer-grid justify-content-center">
      {options
        .filter((option) => option) // This will remove any option that is null or undefined
        .map((option) => {
          // Determine if this option is disabled
          const isOptionDisabled = disabledOptions.includes(option);

          // Apply specific styles or classes if the option is disabled
          const disabledStyle = isOptionDisabled
            ? {
                backgroundColor: "lightgrey",
                color: "darkgrey",
                cursor: "not-allowed",
              }
            : {};

          return (
            <Col key={option} xs={12}>
              <Button
                className="answer-button w-100"
                onClick={() => !isOptionDisabled && handleClick(option)}
                style={{
                  ...disabledStyle,
                  ...(clickedOption === option ? selectedOptionStyle : {}),
                }}
                disabled={isOptionDisabled}
              >
                {option}
              </Button>
            </Col>
          );
        })}
    </Row>
  );
};
export default MCQOptions;
