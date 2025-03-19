import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button, Container } from "react-bootstrap";
import "react-circular-progressbar/dist/styles.css";
import LoadingSpinner from "./loadingspinner";
import {
  HIGH_SCORE_COMMENTS,
  MID_SCORE_COMMENTS,
  LOW_SCORE_COMMENTS,
} from "./constants";

const NewQuizResult = () => {
  const { section } = useParams();
  const [score, setScore] = useState(0);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [currentComment, setCurrentComment] = useState("");
  const [isNewHighScore, setIsNewHighScore] = useState(false);
  const highScoreKey = `newQuizHighScore_${section}`;
  const existingHighScore = parseInt(
    localStorage.getItem(highScoreKey) || "0",
    10
  );

  const getComment = useCallback((scoreValue) => {
    let commentArray;

    if (scoreValue >= 50) {
      commentArray = HIGH_SCORE_COMMENTS;
    } else if (scoreValue >= 20) {
      commentArray = MID_SCORE_COMMENTS;
    } else {
      commentArray = LOW_SCORE_COMMENTS;
    }

    const randomIndex = Math.floor(Math.random() * commentArray.length);
    return commentArray[randomIndex];
  }, []);

  useEffect(() => {
    const savedScore = parseInt(
      localStorage.getItem("newquizScore") || "0",
      10
    );
    setScore(savedScore);

    // Comment logic
    if (currentComment === "") {
      setCurrentComment(getComment(savedScore));
    }

    // High score logic
    if (savedScore > existingHighScore) {
      localStorage.setItem(highScoreKey, savedScore.toString());
      setIsNewHighScore(true);
    }

    localStorage.removeItem("userAnswers");
    setLoading(false); // Data fetching is done at this point, so we can set loading to false
  }, [section, currentComment, getComment, existingHighScore, highScoreKey]);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="quiz-result">
      <h1 className="score-header">
        {isNewHighScore ? "New High Score!" : "You Scored"}
      </h1>
      <div className="results-points-display">
        <div className="results-score-value">{Math.round(score)}</div>
        <div className="results-score-text">Points </div>
      </div>

      <p className="comment-text">{currentComment}</p>

      <div className="d-flex flex-column mt-3">
        <Button
          variant="primary"
          onClick={() => navigate(`/newQuiz/${section}`)}
          className="btn-primary mb-2"
        >
          <i className="bi bi-arrow-counterclockwise me-2"></i> Play Again
        </Button>

        <Button
          variant="secondary"
          onClick={() => navigate(`/quizChoice/${section}`)}
          className="btn-secondary"
        >
          <i className="bi bi-box-arrow-left me-2"></i>
          More Quizzes
        </Button>
      </div>
    </Container>
  );
};

export default NewQuizResult;
