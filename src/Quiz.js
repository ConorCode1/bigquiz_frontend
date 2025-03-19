import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
// import {ProgressBar } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoadingSpinner from "./loadingspinner";
import FeedbackModal from "./FeedbackModal";
import { shuffleArray, levenshtein } from "./utils";
import { compliments, insults } from "./constants";
import MCQOptions from "./MCQOptions";
import FreeformInput from "./FreeformInput";
import PointsDisplay from "./PointsDisplay";
// import scissor from "./Images/scissor.png";
import { GiYinYang } from "react-icons/gi";
import { HiMagnifyingGlassCircle } from "react-icons/hi2";
const Quiz = () => {
  const { section, quizId } = useParams();
  const navigate = useNavigate();
  const [selectedQuiz, setSelectedQuiz] = useState({ questions: [] });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [clickedOption, setClickedOption] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { questions = [] } = selectedQuiz || {};
  const [modalMessage, setModalMessage] = useState("");
  const currentQuestion = questions[currentQuestionIndex];
  const [lastAnswerCorrect, setLastAnswerCorrect] = useState(false);
  const [stepStatus, setStepStatus] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freeformAnswer, setFreeformAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [currentSubject] = useState(localStorage.getItem("subject") || "");
  const uid = localStorage.getItem("uid");
  const [streak, setStreak] = useState(() => {
    const savedStreak = localStorage.getItem("correctAnswerStreak");
    return savedStreak !== null ? Number(savedStreak) : 0;
  });
  const [highestStreak, setHighestStreak] = useState(() => {
    const savedHighestStreak = localStorage.getItem("highestStreak");
    return savedHighestStreak !== null ? Number(savedHighestStreak) : 0;
  });

  const [isFiftyFiftyUsed, setIsFiftyFiftyUsed] = useState(false);
  const [isFirstLetterUsed, setIsFirstLetterUsed] = useState(false);

  const [optionsToRender, setOptionsToRender] = useState([]);
  const [disabledOptions, setDisabledOptions] = useState([]);

  useEffect(() => {
    if (currentQuestion) {
      setOptionsToRender(currentQuestion.options);
    }
  }, [currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setClickedOption(null);
      // setLastAnswerCorrect(false);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setClickedOption(null);
      // setIsFiftyFiftyUsed(false);
      setIsFirstLetterUsed(false);
      setShowModal(false);
    }
    document.activeElement.blur();
  }, [currentQuestionIndex, questions]);

  useEffect(() => {
    const fetchCurrentSubjectScore = async () => {
      // If uid is not present (i.e., user not logged in), do nothing
      if (!uid) return;

      const subjectScoreKey = `${currentSubject}_question_correct_score`;

      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getScore?firebase_uid=${uid}&subject_name=${currentSubject}`
        );

        if (response.status === 404) {
          // Score not found for the user and subject
          // Check if a score exists in local storage, if not set it to 0
          const localScore = localStorage.getItem(subjectScoreKey);
          if (!localScore) {
            localStorage.setItem(subjectScoreKey, "0");
          }
          return;
        }

        const data = await response.json();

        if (data && data.score !== undefined) {
          localStorage.setItem(subjectScoreKey, data.score.toString());
        }
      } catch (error) {
        console.error("Error fetching current subject score:", error);
      }
    };

    fetchCurrentSubjectScore();
  }, [uid, currentSubject]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/section_tbl/${section}`)
      .then((response) => response.json())
      .then((sectionData) => {
        if (sectionData) {
          const sectionId = sectionData.section_id;
          return fetch(
            `${process.env.REACT_APP_API_URL}/quiz_tbl/${sectionId}`
          );
        } else {
          throw new Error(`No section found for section: ${section}`);
        }
      })
      .then((response) => response.json())
      .then((quizzesData) => {
        const foundQuiz = quizzesData.find((quiz) => quiz.quiz_id === quizId);
        if (!foundQuiz) {
          navigate("/");
        } else {
          fetch(
            `${process.env.REACT_APP_API_URL}/quiz/${foundQuiz.quiz_id}/questions`
          )
            .then((response) => response.json())
            .then((questionsData) => {
              const formattedQuestions = questionsData.map((questionData) => ({
                question: questionData.question_text,
                options: shuffleArray([
                  questionData.option_1,
                  questionData.option_2,
                  questionData.option_3,
                  questionData.option_4,
                ]),
                correct_answer: questionData.correct_answer,
                explanation: questionData.explanation,
                question_id: questionData.question_id,
                is_multiple_choice: questionData.is_multiple_choice,
              }));

              // Here we shuffle the found quiz and then slice to first 10 questions.
              setSelectedQuiz({
                ...foundQuiz,
                questions: shuffleArray(formattedQuestions).slice(0, 10),
              });
              setIsLoading(false); // Set loading to false once data is loaded
            });
        }
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load quiz data. Please try again later.");
        setIsLoading(false); // Set loading to false in case of error
      });
  }, [section, quizId, navigate]);

  const updateSubjectScore = useCallback(() => {
    const subjectScoreKey = `${currentSubject}_question_correct_score`;
    let currentSubjectScore = parseInt(
      localStorage.getItem(subjectScoreKey) || "0"
    );
    currentSubjectScore += 1;
    localStorage.setItem(subjectScoreKey, currentSubjectScore.toString());
  }, [currentSubject]);

  const handleFirstLetterLifeline = () => {
    if (!isFirstLetterUsed && currentQuestion) {
      const firstLetter = currentQuestion.correct_answer.charAt(0);
      setFreeformAnswer(firstLetter);
      setIsFirstLetterUsed(true);
    }
  };

  const handleChange = useCallback(
    (selectedOption) => {
      let newUserAnswers = [...answers];
      let currentQuestionId = questions[currentQuestionIndex].question_id;
      let answerIndex = newUserAnswers.findIndex(
        (answer) => answer.question_id === currentQuestionId
      );

      const answerData = {
        question_id: currentQuestionId,
        answer: selectedOption,
      };

      if (answerIndex !== -1) {
        // If user has already answered this question, update the answer
        newUserAnswers[answerIndex] = answerData;
      } else {
        // If user hasn't answered this question before, add new answer
        newUserAnswers.push(answerData);
      }

      setAnswers(newUserAnswers);
      setClickedOption(selectedOption);

      setTimeout(() => {
        setShowModal(true);
      }, 200);

      localStorage.setItem("userAnswers", JSON.stringify(newUserAnswers));

      if (currentQuestion) {
        const correct = selectedOption === currentQuestion.correct_answer;
        setLastAnswerCorrect(correct);

        if (correct) {
          updateSubjectScore();
          setScore((prevScore) => {
            const newScore = prevScore + 10;
            localStorage.setItem("quizScore", newScore.toString());
            return newScore;
          });
          const newStreak = streak + 1;
          setStreak(newStreak);
          localStorage.setItem("correctAnswerStreak", newStreak.toString());

          if (newStreak > highestStreak) {
            setHighestStreak(newStreak);
            localStorage.setItem("highestStreak", newStreak.toString());
          }
        } else {
          setStreak(0);
          localStorage.setItem("correctAnswerStreak", "0");
        }

        const newStepStatus = [...stepStatus];
        newStepStatus[currentQuestionIndex] = correct ? "correct" : "incorrect";
        setStepStatus(newStepStatus);
        const message = correct
          ? compliments[Math.floor(Math.random() * compliments.length)]
          : insults[Math.floor(Math.random() * insults.length)];
        setModalMessage(message);
      }
    },
    [
      answers,
      currentQuestionIndex,
      currentQuestion,
      questions,
      stepStatus,
      updateSubjectScore,
      streak,
      highestStreak,
    ]
  );

  useEffect(() => {}, [selectedQuiz]);

  useEffect(() => {}, [currentQuestionIndex, questions]);

  if (!selectedQuiz) {
    return null;
  }

  const handleComplete = () => {
    const subjectScoreKey = `${currentSubject}_question_correct_score`;
    const currentSubjectScore = parseInt(
      localStorage.getItem(subjectScoreKey) || "0"
    );

    // If uid is present (i.e., user is logged in), update the backend
    if (uid) {
      // Make an API call to save the cumulative subject score to the backend
      fetch(`${process.env.REACT_APP_API_URL}/updateScore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: uid,
          subject_name: currentSubject,
          score: currentSubjectScore, // This is the cumulative score for the subject
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.message) {
            console.log(data.message);
          }
        })
        .catch((error) => {
          console.error("Error updating subject score to backend:", error);
        });
    }

    // Continue with the existing handleComplete logic regardless of user login status
    localStorage.setItem("userAnswers", JSON.stringify(answers));
    navigate(`/quizResult/${section}/${quizId}`);
  };

  const handleModalNext = () => {
    if (currentQuestionIndex === questions.length - 1) {
      handleComplete();
    } else {
      handleNext();
    }
    setShowModal(false);
    // adjust delay as needed
  };

  const handleFreeformSubmit = () => {
    const distance = levenshtein(
      freeformAnswer.trim().toLowerCase(),
      currentQuestion.correct_answer.trim().toLowerCase()
    );

    const correctAnswerLength = currentQuestion.correct_answer.trim().length;

    // New condition to determine if the answer is correct
    const isAnswerCorrect =
      (correctAnswerLength <= 5 && distance === 0) ||
      (correctAnswerLength > 5 && distance <= 2);

    let newUserAnswers = [...answers];
    let currentQuestionId = questions[currentQuestionIndex].question_id;
    let answerIndex = newUserAnswers.findIndex(
      (answer) => answer.question_id === currentQuestionId
    );

    const answerData = {
      question_id: currentQuestionId,
      answer: freeformAnswer,
    };

    if (answerIndex !== -1) {
      newUserAnswers[answerIndex] = answerData;
    } else {
      newUserAnswers.push(answerData);
    }

    setAnswers(newUserAnswers);
    localStorage.setItem("userAnswers", JSON.stringify(newUserAnswers));

    if (isAnswerCorrect) {
      const message =
        compliments[Math.floor(Math.random() * compliments.length)];
      setModalMessage(message);
      setLastAnswerCorrect(true);
      updateSubjectScore();
      setScore((prevScore) => {
        const newScore = prevScore + 10;
        localStorage.setItem("quizScore", newScore.toString());
        return newScore;
      });
      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem("correctAnswerStreak", newStreak.toString());
      if (newStreak > highestStreak) {
        setHighestStreak(newStreak);
        localStorage.setItem("highestStreak", newStreak.toString());
      }
    } else {
      const message = insults[Math.floor(Math.random() * insults.length)];
      setModalMessage(message);
      setLastAnswerCorrect(false);
      setStreak(0);
      localStorage.setItem("correctAnswerStreak", "0");
    }

    const newStepStatus = [...stepStatus];
    newStepStatus[currentQuestionIndex] = isAnswerCorrect
      ? "correct"
      : "incorrect";
    setStepStatus(newStepStatus);

    setShowModal(true);
    setFreeformAnswer("");
  };

  const renderMCQOptions = (optionsToRender) => {
    return (
      <MCQOptions
        options={optionsToRender}
        handleClick={handleChange}
        clickedOption={clickedOption}
        correctAnswer={currentQuestion?.correct_answer}
        disabledOptions={disabledOptions}
      />
    );
  };

  const renderFreeformInput = () => {
    return (
      <FreeformInput
        value={freeformAnswer}
        onChange={(e) => setFreeformAnswer(e.target.value)}
        onSubmit={handleFreeformSubmit}
      />
    );
  };

  const handleFiftyFifty = () => {
    if (!isFiftyFiftyUsed && currentQuestion) {
      const incorrectOptions = currentQuestion.options.filter(
        (option) => option !== currentQuestion.correct_answer
      );

      // Randomly pick two options to disable
      const optionsToDisable = shuffleArray(incorrectOptions).slice(0, 2);

      setDisabledOptions(optionsToDisable);
      setIsFiftyFiftyUsed(true);
    }
  };

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="quiz">
      <Container className="quizscore-container">
        <PointsDisplay score={score} />
        <div className="progress-bar-container">
          {questions.map((question, index) => {
            return (
              <div key={index} className={`step ${stepStatus[index]}`}>
                <span>{index + 1}</span> <i className="bi bi-check"></i>{" "}
                <i className="bi bi-x"></i>
              </div>
            );
          })}
        </div>
      </Container>

      {currentQuestion && (
        <>
          <div className="question-text">
            <h2 style={{ textAlign: "center" }}>{currentQuestion.question}</h2>
          </div>

          {currentQuestion.is_multiple_choice && (
            <button
              className={`fifty-fifty ${isFiftyFiftyUsed ? "used" : ""}`}
              onClick={handleFiftyFifty}
              disabled={isFiftyFiftyUsed}
            >
              {/* <img src={GiScissors} alt="50/50" /> */}
              {/* 50:50  */}
              <GiYinYang className="yinyan-icon" />
            </button>
          )}
          {!currentQuestion.is_multiple_choice && (
            <button
              className={`first-letter-lifeline ${
                isFirstLetterUsed ? "used" : ""
              }`}
              onClick={handleFirstLetterLifeline}
              disabled={isFirstLetterUsed}
            >
              <HiMagnifyingGlassCircle className="wand-icon" />
            </button>
          )}

          {currentQuestion.is_multiple_choice
            ? renderMCQOptions(optionsToRender, disabledOptions)
            : renderFreeformInput()}
        </>
      )}

      <FeedbackModal
        showModal={showModal}
        onHide={() => setShowModal(false)}
        lastAnswerCorrect={lastAnswerCorrect}
        modalMessage={modalMessage}
        currentQuestion={currentQuestion}
        onNext={handleModalNext}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
      />
    </Container>
  );
};

export default Quiz;
