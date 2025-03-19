import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Container } from "react-bootstrap";
import "bootstrap-icons/font/bootstrap-icons.css";
import LoadingSpinner from "./loadingspinner";
import NewQuizModal from "./NewQuizModal";
import { shuffleArray, levenshtein } from "./utils";
import { compliments, insults } from "./constants";
import MCQOptions from "./MCQOptions";
import FreeformInput from "./FreeformInput";
import ProgressBarTimer from "./Timer";
import PointsDisplay from "./PointsDisplay";

const NewQuiz = () => {
  const { section } = useParams();
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [freeformAnswer, setFreeformAnswer] = useState("");
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [originalTime] = useState(60);
  const [timeModification, setTimeModification] = useState(0);
  const [questionStartTime, setQuestionStartTime] = useState(Date.now());
  const [currentSubject] = useState(localStorage.getItem("subject") || "");
  const uid = localStorage.getItem("uid");
  const [disabledOptions, setDisabledOptions] = useState([]);

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setClickedOption(null);
      setShowModal(false);
      setQuestionStartTime(Date.now());
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
          return fetch(
            `${process.env.REACT_APP_API_URL}/section/${sectionData.section_id}/questions`
          );
        } else {
          throw new Error(`No section found for section: ${section}`);
        }
      })
      .then((response) => response.json())
      .then((questionsData) => {
        const allQuestions = questionsData.map((questionData) => ({
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

        setSelectedQuiz({
          questions: shuffleArray(allQuestions),
        });
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setError("Failed to load quiz data. Please try again later.");
        setIsLoading(false);
      });
  }, [section, navigate]);

  const updateSubjectScore = useCallback(() => {
    const subjectScoreKey = `${currentSubject}_question_correct_score`;
    let currentSubjectScore = parseInt(
      localStorage.getItem(subjectScoreKey) || "0"
    );
    currentSubjectScore += 1;
    localStorage.setItem(subjectScoreKey, currentSubjectScore.toString());
  }, [currentSubject]);

  const handleTimeUpdate = useCallback(
    (newTime) => {
      if (newTime !== timeLeft) {
        setTimeLeft(newTime);
      }
    },
    [timeLeft]
  );

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
        newUserAnswers[answerIndex] = answerData;
      } else {
        newUserAnswers.push(answerData);
      }

      setAnswers(newUserAnswers);
      setClickedOption(selectedOption);

      setShowModal(true);
      setDisabledOptions([]);

      localStorage.setItem("userAnswers", JSON.stringify(newUserAnswers));

      if (currentQuestion) {
        const correct = selectedOption === currentQuestion.correct_answer;
        const timeTaken = (Date.now() - questionStartTime) / 1000; // in seconds
        let pointsAwarded = 11 - Math.ceil(timeTaken / 2); // Calculate points based on time taken
        pointsAwarded = Math.max(pointsAwarded, 1); // Ensure minimum points is 1

        if (correct) {
          updateSubjectScore();
          setScore((prevScore) => prevScore + pointsAwarded);
          setTimeModification(5); // You may adjust this as needed
        } else {
          setTimeModification(-0.5);
        }
        setLastAnswerCorrect(correct);
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
      questionStartTime,
      updateSubjectScore,
    ]
  );

  useEffect(() => {
    const decrementTime = () => {
      if (!showModal && timeLeft > 0) {
        setTimeLeft((prevTime) => prevTime - 1);
      } else if (timeLeft <= 0) {
        handleTimerComplete();
      }
    };
    const timer = setInterval(decrementTime, 1000);
    return () => clearInterval(timer);
  }, [showModal, timeLeft]);

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
    navigate(`/newQuizResult/${section}`);
  };

  const handleTimerComplete = () => {
    setShowModal(true);
    setModalMessage("Time's up!");
  };

  const handleModalNext = () => {
    let newTime;
    if (timeModification === -0.5) {
      newTime = Math.ceil(timeLeft / 2);
    } else {
      newTime = timeLeft + timeModification;
    }

    newTime = Math.min(newTime, 60);

    setTimeLeft(newTime);
    setTimeModification(0);

    if (currentQuestionIndex === questions.length - 1 || newTime === 0) {
      handleComplete();
    } else {
      handleNext();
    }
    setShowModal(false);
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
      const timeTaken = (Date.now() - questionStartTime) / 1000;
      let pointsAwarded = 11 - Math.ceil(timeTaken / 2);
      pointsAwarded = Math.max(pointsAwarded, 1);
      updateSubjectScore();
      setScore((prevScore) => {
        return prevScore + pointsAwarded;
      });
      setTimeModification(8);
      const message =
        compliments[Math.floor(Math.random() * compliments.length)];
      setModalMessage(message);
      setLastAnswerCorrect(true);
    } else {
      setTimeModification(-0.5);

      const message = insults[Math.floor(Math.random() * insults.length)];
      setModalMessage(message);
      setLastAnswerCorrect(false);
    }

    setShowModal(true);
    setFreeformAnswer("");
  };

  const renderMCQOptions = () => {
    return (
      <MCQOptions
        options={currentQuestion?.options}
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

  localStorage.setItem("newquizScore", score.toString());

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <Container className="quiz">
      <PointsDisplay score={score} />
      <ProgressBarTimer
        timeLeft={timeLeft}
        originalTime={originalTime}
        onComplete={handleTimerComplete}
        onTimeUpdate={handleTimeUpdate}
        isModalOpen={showModal}
      />

      {currentQuestion && (
        <>
          <div className="question-text">
            <h2 style={{ textAlign: "center" }}>{currentQuestion.question}</h2>
          </div>
          {currentQuestion.is_multiple_choice
            ? renderMCQOptions()
            : renderFreeformInput()}
        </>
      )}
      <NewQuizModal
        showModal={showModal}
        onHide={() => setShowModal(false)}
        lastAnswerCorrect={lastAnswerCorrect}
        modalMessage={modalMessage}
        currentQuestion={currentQuestion}
        onNext={handleModalNext}
        isLastQuestion={currentQuestionIndex === questions.length - 1}
        timeExpired={timeLeft === 0}
      />
    </Container>
  );
};

export default NewQuiz;
