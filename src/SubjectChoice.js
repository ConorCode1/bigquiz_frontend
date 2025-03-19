import React, { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import earth from "./Images/earth.png";
import plant from "./Images/plant.png";
import finance from "./Images/financial-profit.png";
import museum from "./Images/museum.png";
import periodic from "./Images/periodic.png";
import atom from "./Images/atom.png";
import fire from "./Images/fire.png";
import check from "./Images/check1.png";
import day from "./Images/calendar.png";

const SubjectChoice = () => {
  const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
  const [correctAnswerStreak, setCorrectAnswerStreak] = useState(0);
  const [highestStreak, setHighestStreak] = useState(0);
  const [dayStreak, setDayStreak] = useState(0);

  const lastClickedSubject = useRef(null);

  const [comingSoon, setComingSoon] = useState({
    Business: false,
    Chemistry: false,
    Physics: false,
  });

  const subjects = useMemo(
    () => [
      {
        name: "Biology",
        icon: <img src={plant} alt="plant" className="subject-icon-bio" />,
      },
      {
        name: "Business",
        icon: <img src={finance} alt="business" className="subject-icon-bus" />,
      },
      {
        name: "Geography",
        icon: <img src={earth} alt="earth" className="subject-icon-chem" />,
      },
      {
        name: "History",
        icon: <img src={museum} alt="museum" className="subject-icon-phys" />,
      },
      {
        name: "Chemistry",
        icon: <img src={periodic} alt="table" className="subject-icon-phys" />,
      },
      {
        name: "Physics",
        icon: <img src={atom} alt="atom" className="subject-icon-phys" />,
      },
    ],
    []
  );

  const handleSubjectStart = (subjectName) => {
    if (
      ["Business", "Geography", "History", "Chemistry", "Physics"].includes(
        subjectName
      )
    ) {
      setComingSoon({ ...comingSoon, [subjectName]: true });
      lastClickedSubject.current = subjectName;
    } else {
      navigate(`/quizSelection/${subjectName}`, { state: { from: "/" } });
    }
  };

  useEffect(() => {
    const savedCorrectStreak = localStorage.getItem("correctAnswerStreak");
    const savedHighestStreak = localStorage.getItem("highestStreak");
    const savedDayStreak = localStorage.getItem("currentStreak");

    setCorrectAnswerStreak(
      savedCorrectStreak !== null ? parseInt(savedCorrectStreak, 10) : 0
    );

    setHighestStreak(
      savedHighestStreak !== null ? parseInt(savedHighestStreak, 10) : 0
    );

    setDayStreak(savedDayStreak !== null ? parseInt(savedDayStreak, 10) : 0);

    return () => {
      localStorage.removeItem("subject");
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (lastClickedSubject.current) {
        const subjectName = lastClickedSubject.current;
        if (comingSoon[subjectName]) {
          setComingSoon({ ...comingSoon, [subjectName]: false });
        }
        lastClickedSubject.current = null;
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [comingSoon]);

  return (
    <div className="subject-selection container">
      <div className="subject-screen-header">Subjects</div>
      <div className="align-container">
        <div className="subject-screen-header-secondary"></div>
        <div className="grid-container">
          {subjects.map((subject, index) => (
            <div className="grid-item" key={index}>
              <button
                className={`btn btn-primary subject-button ${subject.color} ${
                  comingSoon[subject.name] ? "coming-soon" : ""
                }`}
                onClick={() => handleSubjectStart(subject.name)}
              >
                {!comingSoon[subject.name] && subject.icon}
                {!comingSoon[subject.name] && (
                  <div className="subject-text-background">{subject.name}</div>
                )}
                {comingSoon[subject.name] && (
                  <div className="coming-soon-banner">Coming Soon!</div>
                )}
              </button>
            </div>
          ))}
        </div>
        {/* <div className="subject-screen-header">Stats</div> */}
        <div className="stats">
          <div className="streaks-display">
            <div className="streak-info">
              <span className="streak-number">{highestStreak}</span>
              {highestStreak > 0 && (
                <img src={fire} alt="Streak" className="streak-icon" />
              )}
            </div>
            <div className="streak-description">
              <img src={check} alt="Check" className="check-icon" />
              <div>Answer Streak</div>
            </div>
          </div>

          <div className="streaks-display">
            <div className="streak-info">
              <span className="streak-number">{dayStreak}</span>
              {dayStreak > 0 && (
                <img src={fire} alt="No Streak" className="streak-icon" />
              )}
            </div>
            <div className="streak-description">
              <img src={day} alt="Check" className="check-icon" />
              <div>Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectChoice;
