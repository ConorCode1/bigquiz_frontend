import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgressbar } from "react-circular-progressbar";
import { Button, Container } from "react-bootstrap";
import "react-circular-progressbar/dist/styles.css";
import {
  HIGH_SCORE_COMMENTS,
  MID_SCORE_COMMENTS,
  LOW_SCORE_COMMENTS,
} from "./constants";

const getComment = (score) => {
  let commentArray;

  if (score >= 80) {
    commentArray = HIGH_SCORE_COMMENTS;
  } else if (score >= 40) {
    commentArray = MID_SCORE_COMMENTS;
  } else {
    commentArray = LOW_SCORE_COMMENTS;
  }

  const randomIndex = Math.floor(Math.random() * commentArray.length);
  return commentArray[randomIndex];
};

const clearCachedCompletionPercentage = (sectionName) => {
  localStorage.removeItem(`completionPercentage_${sectionName}`);
};

const QuizResult = () => {
  const { section, quizId } = useParams();
  const navigate = useNavigate();
  const [currentComment, setCurrentComment] = useState("");
  const savedScore = parseInt(localStorage.getItem("quizScore") || "0", 10);

  useEffect(() => {
    const highScoreKey = `highScore_${section}_${quizId}`;
    const existingHighScore = parseInt(
      localStorage.getItem(highScoreKey) || "0",
      10
    );

    if (savedScore > existingHighScore) {
      localStorage.setItem(highScoreKey, savedScore.toString());
      clearCachedCompletionPercentage(section);
    }

    if (currentComment === "") {
      setCurrentComment(getComment(savedScore));
    }

    const lastPlayDay = localStorage.getItem("lastPlayDay");
    let currentStreak = parseInt(
      localStorage.getItem("currentStreak") || "0",
      10
    );

    const today = new Date();
    const currentDate = today.toISOString().split("T")[0];

    if (lastPlayDay) {
      const date1 = new Date(lastPlayDay);
      const date2 = new Date(currentDate);

      const diffTime = Math.abs(date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        currentStreak += 1;
      } else if (diffDays > 1) {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }

    // Update local storage with the new streak and the current play day
    localStorage.setItem("currentStreak", currentStreak.toString());
    localStorage.setItem("lastPlayDay", currentDate);
  }, [savedScore, section, quizId, currentComment]);

  const progressColor =
    savedScore >= 80 ? "green" : savedScore >= 40 ? "orange" : "red";
  return (
    <Container className="quiz-result">
      <h1 className="score-header">You Scored</h1>

      <div style={{ width: "70%", maxWidth: "200px" }}>
        <CircularProgressbar
          value={savedScore}
          text={`${savedScore}%`}
          styles={{
            path: {
              stroke: progressColor,
            },
            text: {
              fill: "#ebebeb",
              fontWeight: "bold",
            },
          }}
        />
      </div>

      <p className="comment-text">{currentComment}</p>

      <div className="d-flex flex-column mt-3">
        <Button
          variant="primary"
          onClick={() => navigate(`/quiz/${section}/${quizId}`)}
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

export default QuizResult;
