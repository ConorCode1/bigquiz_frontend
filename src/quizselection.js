import React, { useState, useEffect } from "react";
import LoadingSpinner from "./loadingspinner";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { ProgressBar } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import fly from "./Images/dragonfly.jpeg";
import apple1 from "./Images/apple1.jpeg";
import beaker from "./Images/sciencebeaker.jpeg";
import bog from "./Images/irish_bog.jpeg";
import fox1 from "./Images/fox2.png";
import ms from "./Images/mitosis.jpeg";
import cell from "./Images/cell.jpeg";
import beer from "./Images/beer.jpeg";
import xylem from "./Images/xylem.webp";
import helix from "./Images/helix.jpeg";
import mushroom from "./Images/mushroom.jpeg";
import roots from "./Images/roots.jpeg";
import veins from "./Images/veins.jpeg";
import breath from "./Images/breath.jpeg";
import trophism from "./Images/trophism.png";
import flower from "./Images/flower.jpeg";
// import oneexp from "./Images/oneexperiment.png";

const CURRENT_VERSION = 9;

const fetchData = async (url) => {
  // Get the cached data and its version
  const cachedData = localStorage.getItem(url);
  const cachedVersion = localStorage.getItem(`${url}_version`);

  // If there's cached data and its version matches the current version, return the cached data
  if (cachedData && parseInt(cachedVersion, 10) === CURRENT_VERSION) {
    return JSON.parse(cachedData);
  }

  // Fetch the data from the server
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    const data = await response.json();

    // Store the data and its version in localStorage
    localStorage.setItem(url, JSON.stringify(data));
    localStorage.setItem(`${url}_version`, CURRENT_VERSION);

    return data;
  } else {
    return { quizzes: [] };
  }
};

const getSectionCompletion = (sectionName, quizzesForSection) => {
  try {
    if (!quizzesForSection || !Array.isArray(quizzesForSection.quizzes)) {
      return 0; // Return a default value (e.g., 0) if quizzes aren't defined or aren't an array
    }

    const totalScore = quizzesForSection.quizzes.reduce((acc, quiz) => {
      const highScoreKey = `highScore_${sectionName}_${quiz.quiz_id}`;
      const score = parseInt(localStorage.getItem(highScoreKey) || "0", 10);
      return acc + score;
    }, 0);

    const completionPercentage = totalScore / quizzesForSection.quizzes.length;
    return completionPercentage;
  } catch (error) {
    console.error(`Error in getSectionCompletion for ${sectionName}:`, error);
    return 0; // Return a default value in case of error
  }
};

const getCachedCompletionPercentage = (sectionName) => {
  const cachedPercentage = localStorage.getItem(
    `completionPercentage_${sectionName}`
  );
  return cachedPercentage ? parseFloat(cachedPercentage) : null;
};

const setCachedCompletionPercentage = (sectionName, percentage) => {
  localStorage.setItem(
    `completionPercentage_${sectionName}`,
    percentage.toString()
  );
};

const subjectData = {
  Biology: [
    {
      // unitNumber: "Unit One",
      unitTitle: "Unit One: The Study of Life",
      sections: [
        "THE SCIENTIFIC METHOD",
        "CHARACTERISTICS OF LIFE",
        "NUTRITION",
        "PRINCIPLES OF ECOLOGY",
        "THE STUDY OF AN ECOSYSTEM",
        // "UNIT ONE EXPERIMENTS",
      ],
      images: [beaker, fly, apple1, fox1, bog],
    },
    {
      // unitNumber: "Unit Two",
      unitTitle: "Unit Two: The Cell",
      sections: [
        "CELL STRUCTURE",
        "CELL METABOLISM",
        "CELL CONTINUITY",
        "CELL DIVERSITY",
        "GENETICS",
      ],
      images: [cell, beer, ms, xylem, helix],
    },

    {
      // unitNumber: "Unit Three",
      unitTitle: "Unit Three: The Organism",
      sections: [
        "DIVERSITY OF ORGANISMS",
        "BREATHING SYSTEM AND EXCRETION",
        "RESPONSES TO STIMULI",
        "THE VASCULAR STRUCTURES",
        "TRANSPORT AND NUTRITION",
        "REPRODUCTION AND GROWTH",
      ],
      images: [mushroom, breath, trophism, veins, roots, flower],
    },
  ],
  Chemistry: [
    {
      unitTitle: "Chem 1",
      sections: ["THE SCI"],
      images: [beaker],
    },
  ],
  Physics: [
    {
      unitTitle: "Phys 1",
      sections: ["THE SCIR"],
      images: [beaker],
    },
  ],
  Business: [
    {
      unitTitle: "Phys 1",
      sections: ["THE SCIR"],
      images: [beaker],
    },
  ],
};

const QuizSelection = () => {
  const [completionPercentages, setCompletionPercentages] = useState({});
  const { subject } = useParams();
  const navigate = useNavigate();
  const units = subjectData[subject];
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const location = useLocation();
  const [selectedUnit, setSelectedUnit] = useState(
    sessionStorage.getItem("selectedUnit") || units[0].unitTitle
  );
  const [displayUnit, setDisplayUnit] = useState(
    sessionStorage.getItem("selectedUnit") || units[0].unitTitle
  );

  useEffect(() => {
    const fetchAllSectionsData = async () => {
      const allSections = units.flatMap((unit) => unit.sections);
      const sectionsQuery = allSections.join(",");

      // Use the sectionsQuery to make a request to the new endpoint
      const url = `${
        process.env.REACT_APP_API_URL
      }/sections/quizzes?sections=${encodeURIComponent(sectionsQuery)}`;
      const data = await fetchData(url);
      const allData = {};
      const percentages = {};
      for (const section of allSections) {
        if (data[section]) {
          allData[section] = data[section]; // Store the complete data for the section, not just quizzes

          // Try to get the cached completion percentage
          const cachedPercentage = getCachedCompletionPercentage(section);

          if (cachedPercentage !== null) {
            percentages[section] = cachedPercentage;
          } else {
            // If not cached, calculate it
            const completion = getSectionCompletion(section, allData[section]);
            percentages[section] = completion;
            setCachedCompletionPercentage(section, completion);
          }
        } else {
          // Handle error (e.g., section not found in database)
        }
      }

      setCompletionPercentages(percentages);
      setLoading(false);
    };

    fetchAllSectionsData();
  }, [units]);

  useEffect(() => {
    localStorage.setItem("subject", subject);
  }, [subject]);

  const handleQuizStart = (section) => {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop;
    localStorage.setItem("quizSelectionScrollPosition", scrollPosition);
    navigate(`/quizChoice/${section}`);
  };

  useEffect(() => {
    const previousPath = localStorage.getItem("navigateFrom");

    if (previousPath && previousPath === "/") {
      window.scrollTo(0, 0);
    } else {
      const savedScrollPosition = localStorage.getItem(
        "quizSelectionScrollPosition"
      );
      if (savedScrollPosition !== null) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollPosition, 10));
        }, 10);
      }
    }

    localStorage.removeItem("navigateFrom");
    localStorage.removeItem("quizSelectionScrollPosition");
  }, [location]);

  useEffect(() => {
    const preloadImages = async () => {
      const allImages = units.flatMap((unit) => unit.images);

      const promises = allImages.map((imgSrc) => {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.src = imgSrc;
          img.onload = resolve;
          img.onerror = reject;
        });
      });

      try {
        await Promise.all(promises);
        setImagesLoaded(true);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };
    preloadImages();
  }, [units]);

  if (!imagesLoaded || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="master-quiz-selection-container">
      <div className="quiz-selection container quiz-selection-container">
        <div className="subject-title">{subject}</div>
        <div className="dropdown-wrapper">
          <div className="fake-dropdown">{displayUnit}</div>
          <select
            className="unit-dropdown-real" // Note the updated class name here
            value={selectedUnit}
            onChange={(e) => {
              const selectedValue = e.target.value;
              setDisplayUnit(selectedValue); // Update the display text when the selection changes
              setSelectedUnit(selectedValue);
              sessionStorage.setItem("selectedUnit", selectedValue);
            }}
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              height: "100%",
              width: "100%",
            }} // Inline styles to hide the real dropdown and stretch it over the fake dropdown
          >
            {units.map((unit, index) => (
              <option key={index} value={unit.unitTitle}>
                {unit.unitTitle}
              </option>
            ))}
          </select>
          <span className="custom-arrow">{"\u25BC"}</span>
        </div>
        {units
          .filter((unit) => !selectedUnit || unit.unitTitle === selectedUnit)
          .map((unit, unitIndex) => (
            <div key={unitIndex}>
              <div className="row">
                {unit.sections.map((section, sectionIndex) => {
                  const completion = completionPercentages[section] || 0;
                  return (
                    <div
                      className="col-12 mb-3 button-container"
                      key={sectionIndex}
                    >
                      <button
                        className="btn btn-primary large-button"
                        onClick={() => handleQuizStart(section)}
                        style={{
                          backgroundImage: `url(${unit.images[sectionIndex]})`,
                        }}
                      >
                        <div className="text-background">{section}</div>
                        <div className="progress-container">
                          <ProgressBar
                            now={completion}
                            label={`${completion.toFixed(0)}%`}
                            className="progress-label"
                          />
                          {completion === 0 && (
                            <div className="zero-completion-label">0%</div>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};
export default QuizSelection;
