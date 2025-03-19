import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "./loadingspinner";
import { BsFillStarFill } from "react-icons/bs";
import lock from "./Images/lock.png";
import watch from "./Images/stopwatch.png";
import LockModal from "./LockModal";

const QuizChoice = () => {
  const { section } = useParams();
  const navigate = useNavigate();
  const [sectionData, setSectionData] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(false);
  const colors = [
    "#46505A",
    "#3da896",
    "#FF5F54",
    "#17B360",
    "#DB2A68",
    "#1195FF",
  ];
  const newhighScoreKey = `newQuizHighScore_${section}`;
  const newhighScore = localStorage.getItem(newhighScoreKey) || "0";
  const [isRocketModeDisabled, setRocketModeDisabled] = useState(true);
  const [showLockedModal, setShowLockedModal] = useState(false);
  const [shuffledColors, setShuffledColors] = useState([]);

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array; // return the shuffled array
  }

  useEffect(() => {
    const initialColors = [
      "#46505A",
      "#3da896",
      "#FF5F54",
      "#17B360",
      "#DB2A68",
      "#1195FF",
    ];
    setShuffledColors(shuffleArray([...initialColors]));
  }, []);

  const getStarColor = (score) => {
    if (score >= 100) {
      return ["gold", "gold", "gold"];
    } else if (score >= 70) {
      return ["gold", "gold", "#212122ff"];
    } else if (score >= 40) {
      return ["gold", "#212122ff", "#212122ff"];
    } else {
      return ["#212122ff", "#212122ff", "#212122ff"];
    }
  };

  const handleRocketButtonClick = () => {
    if (isRocketModeDisabled) {
      setShowLockedModal(true);
    } else {
      navigate(`/newQuiz/${section}`);
    }
  };

  useEffect(() => {}, [showLockedModal]);

  useEffect(() => {
    let timer = setTimeout(() => setLoading(true), 50);
    fetch(
      `${process.env.REACT_APP_API_URL}/section_tbl/${encodeURIComponent(
        section
      )}/quizzes`
    )
      .then((response) => response.json())
      .then((data) => {
        clearTimeout(timer);
        setSectionData(data.section);
        setQuizzes(data.quizzes);
        const allQuizzesHaveHighScore = data.quizzes.every((quiz) => {
          const highScoreKey = `highScore_${section}_${quiz.quiz_id}`;
          const highScore = localStorage.getItem(highScoreKey) || "0";
          return parseInt(highScore, 10) >= 40;
        });
        setRocketModeDisabled(!allQuizzesHaveHighScore);
        setLoading(false);
      })
      .catch((error) => {
        console.error(error);
        clearTimeout(timer);
        setLoading(false);
      });
  }, [section]);

  const onQuizSelect = (quiz) => {
    const isSignedIn = localStorage.getItem("isSignedIn") === "true";
    if (isSignedIn) {
      navigate(`/quiz/${section}/${quiz.quiz_id}`);
    } else {
      navigate("/signup");
    }
  };

  function capitalizeWords(input) {
    const lowerCased = input.toLowerCase();
    return lowerCased
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  shuffleArray(colors);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!sectionData) {
    return null;
  }

  return (
    <div className="master-choice-container">
      {showLockedModal && (
        <LockModal onClose={() => setShowLockedModal(false)} />
      )}

      <div className="choice-title">
        <span className="choice-section">
          {capitalizeWords(sectionData.section_name)}
        </span>
        {/* <span className="choice-body">Select a Quiz</span> */}
      </div>

      <div className="buttons-container-master">
        <div className="quiz-choice-button-container">
          {quizzes.map((quiz, index) => {
            const highScoreKey = `highScore_${section}_${quiz.quiz_id}`;
            const highScore = localStorage.getItem(highScoreKey) || "0";
            const starColors = getStarColor(parseInt(highScore, 10));

            return (
              <button
                key={index}
                onClick={() => onQuizSelect(quiz)}
                className="quiz-choice-button"
                style={{
                  backgroundColor:
                    shuffledColors[index % shuffledColors.length],
                }}
              >
                <div className="stars-container">
                  <BsFillStarFill
                    className="star-icon"
                    style={{ color: starColors[0], margin: "0 5px" }}
                  />
                  <BsFillStarFill
                    className="star-icon"
                    style={{ color: starColors[1], margin: "0 5px" }}
                  />
                  <BsFillStarFill
                    className="star-icon"
                    style={{ color: starColors[2], margin: "0 5px" }}
                  />
                </div>

                <span className="quiz-text">{quiz.quiz_name}</span>
                <div className="score-container">
                  Complete: <span className="best-score">{highScore}%</span>
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={handleRocketButtonClick}
          className={`rocket-button ${
            isRocketModeDisabled ? "disabled-button" : ""
          }`}
        >
          <img src={watch} alt="rocket" className="rocket-mode-icon" />
          Time Rush
          <div className="new-score-container">
            High Score: <span className="new-best-score">{newhighScore}</span>
          </div>
          {isRocketModeDisabled && (
            <img src={lock} alt="Locked" className="lock-icon" />
          )}
        </button>
      </div>
    </div>
  );
};

export default QuizChoice;
