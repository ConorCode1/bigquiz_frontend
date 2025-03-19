import { React, useState } from "react";
import bugcatcher from "./Images/fox2.png";
import labassistant from "./Images/fox2.png";
import zooologist from "./Images/fox2.png";
import genomic from "./Images/fox2.png";
import darwin from "./Images/fox2.png";
import { IoInformationCircle } from "react-icons/io5";
import InfoModal from "./InfoModal";

const Badges = () => {
  const subjects = ["Biology", "Business"];
  const [showInfoModal, setShowInfoModal] = useState(false);
  const toggleInfoModal = () => {
    setShowInfoModal((prev) => !prev);
  };

  const getSubjectScore = (subject) => {
    const score = localStorage.getItem(`${subject}_question_correct_score`);
    return score ? parseInt(score, 10) : 0;
  };

  const getSubjectLevel = (score) => {
    if (score >= 800) return 5;
    if (score >= 400) return 4;
    if (score >= 200) return 3;
    if (score >= 50) return 2;
    return 1;
  };

  const getProgressPercentage = (score, level) => {
    switch (level) {
      case 1:
        return (score / 50) * 100;
      case 2:
        return ((score - 50) / 150) * 100;
      case 3:
        return ((score - 200) / 200) * 100;
      case 4:
        return ((score - 400) / 400) * 100;
      case 5:
        return 100;
      default:
        return 0;
    }
  };

  const getPointsToNextLevel = (score, level) => {
    switch (level) {
      case 1:
        return 50 - score;
      case 2:
        return 200 - score;
      case 3:
        return 400 - score;
      case 4:
        return 800 - score;
      case 5:
        return 0;
      default:
        return 0;
    }
  };

  const getBadgeImage = (level) => {
    switch (level) {
      case 1:
        return bugcatcher;
      case 2:
        return labassistant;
      case 3:
        return zooologist;
      case 4:
        return genomic;
      case 5:
        return darwin;
      default:
        return bugcatcher;
    }
  };

  const getBadgeRank = (level) => {
    switch (level) {
      case 1:
        return "Bug Catcher";
      case 2:
        return "Lab Assistant";
      case 3:
        return "Cowboy Zoologist";
      case 4:
        return "Genomic Genius";
      case 5:
        return "Charles Darwin";
      default:
        return labassistant;
    }
  };

  return (
    <div className="badges-container">
      <div className="badges-title">
        Badges
        <button onClick={toggleInfoModal} className="info-button">
          <IoInformationCircle />
        </button>
      </div>
      {showInfoModal && <InfoModal onClose={toggleInfoModal} />}
      {subjects.map((subject) => {
        const score = getSubjectScore(subject);

        if (score === 0 && subject !== "Biology") return null;

        const level = getSubjectLevel(score);
        const progressPercentage = getProgressPercentage(score, level);
        const pointsToNext = getPointsToNextLevel(score, level);
        const badgeImage = getBadgeImage(level);
        const badgeRank = getBadgeRank(level);

        return (
          <div key={subject} className="subject-badge">
            <div className="badge-left">
              <div className="badge-title">{badgeRank}</div>

              <img
                src={badgeImage}
                alt={`Level ${level}`}
                className="badge-image"
              />
              <div className="subject-score">Level {level}</div>
            </div>
            <div className="badge-content">
              {/* <div className="subject-name">{subject}</div> */}
              <div className="badge-points-display">
                <div className="badge-score-text">Total Points</div>
                <div className="badge-score-value">{Math.round(score)}</div>
              </div>

              {level < 5 ? (
                <>
                  <div className="badge-progress-bar-container">
                    <span className="points-text">
                      {pointsToNext} points to the next level!
                    </span>
                    <div
                      className="badge-progress-bar"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </>
              ) : (
                <div className="master-level">Master Status Achieved</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Badges;
