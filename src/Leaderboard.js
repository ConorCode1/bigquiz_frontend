import React, { useState, useEffect } from "react";
// import Podium from "./Podium";

const fetchLeaderboardData = async (subject, schoolId = null) => {
  try {
    let url = `${process.env.REACT_APP_API_URL}/getLeaderboardData?subject_name=${subject}`;
    if (schoolId) {
      url += `&school_id=${schoolId}`;
    }

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
    return [];
  }
};

const fetchSchoolLeaderboardData = async (subject) => {
  try {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/getSchoolLeaderboardData?subject_name=${subject}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();

    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error(
      "There was a problem with the fetch operation:",
      error.message
    );
    return [];
  }
};

const Leaderboard = () => {
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [subject, setSubject] = useState("Biology");
  const [leaderboardType, setLeaderboardType] = useState("Student");
  const LEADERBOARD_KEY = (subject, type) =>
    `${subject}_${type}_leaderboard_data`;
  const SCORE_KEY = (subject) => `${subject}_question_correct_score`;
  // const [lastKnownScore, setLastKnownScore] = useState(-1);

  const LAST_KNOWN_SCORE_KEY = "last_known_score";
  const [displaySubject, setDisplaySubject] = useState("Biology");

  useEffect(() => {
    const fetchData = async (currentScore) => {
      let data = [];
      if (leaderboardType === "Student") {
        data = await fetchLeaderboardData(subject);
      } else if (leaderboardType === "School") {
        data = await fetchSchoolLeaderboardData(subject);
      } else if (leaderboardType === "My School") {
        const userSchoolId = localStorage.getItem("user_school_id") || "1455";
        data = await fetchLeaderboardData(subject, userSchoolId);
      }

      if (Array.isArray(data)) {
        setLeaderboardData(data);
        sessionStorage.setItem(
          LEADERBOARD_KEY(subject, leaderboardType),
          JSON.stringify(data)
        );
        sessionStorage.setItem(LAST_KNOWN_SCORE_KEY, currentScore);
      } else {
        console.error("Fetched data is not an array:", data);
        setError("Failed to fetch leaderboard data.");
      }
    };

    (async () => {
      setLoading(true);
      try {
        const currentScore = localStorage.getItem(SCORE_KEY(subject)) || 0;
        const cachedData = sessionStorage.getItem(
          LEADERBOARD_KEY(subject, leaderboardType)
        );
        const lastScore = sessionStorage.getItem(LAST_KNOWN_SCORE_KEY) || -1;

        const shouldFetchNewData =
          leaderboardType === "School" ||
          leaderboardType === "My School" ||
          !cachedData ||
          parseInt(lastScore, 10) !== parseInt(currentScore, 10);

        if (shouldFetchNewData) {
          await fetchData(currentScore);
        } else {
          setLeaderboardData(JSON.parse(cachedData));
        }
      } catch (err) {
        console.error("Error in fetching leaderboard data:", err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [subject, leaderboardType]);

  return (
    <div className="master-leaderboard-container">
      <div className="leaderboard-container">
        <div className="leaderboard-title">Leaderboard</div>
        <div className="dropdown-container">
          <div className="pills-container">
            <button
              className={`pill ${
                leaderboardType === "Student" ? "active" : ""
              }`}
              onClick={() => setLeaderboardType("Student")}
            >
              Student
            </button>
            <button
              className={`pill ${
                leaderboardType === "My School" ? "active" : ""
              }`}
              onClick={() => setLeaderboardType("My School")}
            >
              My School
            </button>
            <button
              className={`pill ${leaderboardType === "School" ? "active" : ""}`}
              onClick={() => setLeaderboardType("School")}
            >
              All Schools
            </button>
          </div>
          <div className="dropdown-wrapper">
            <div className="subject-fake-dropdown">{displaySubject}</div>
            <select
              className="unit-dropdown-real subject-dropdown"
              value={subject}
              onChange={(e) => {
                const selectedValue = e.target.value;
                setDisplaySubject(selectedValue);
                setSubject(selectedValue);
              }}
              style={{
                opacity: 0,
                position: "absolute",
                top: 0,
                left: 0,
                height: "100%",
                width: "100%",
              }}
            >
              <option value="Biology">Biology</option>
              {/* ... other subject options */}
            </select>
            <span className="custom-arrow leaderboard-arrow">{"\u25BC"}</span>
          </div>
        </div>
        {/* <Podium topThree={leaderboardData.slice(0, 3)} /> */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                {/* Render Name, School, County for both Student and My School types */}
                {leaderboardType === "Student" ||
                leaderboardType === "My School" ? (
                  <>
                    <th>Name</th>
                    <th>School</th>
                    <th>County</th>
                  </>
                ) : (
                  <>
                    <th>School</th>
                    <th>County</th>
                  </>
                )}
                <th>Score</th>
              </tr>
            </thead>
            <tbody>
              {leaderboardData.map((row, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  {leaderboardType === "Student" ||
                  leaderboardType === "My School" ? (
                    <>
                      <td>{row.display_name}</td>
                      <td>{row.school_name}</td>
                      <td>{row.school_county}</td>
                    </>
                  ) : (
                    <>
                      <td>{row.school_name}</td>
                      <td>{row.school_county}</td>
                    </>
                  )}
                  <td>
                    {leaderboardType === "Student" ||
                    leaderboardType === "My School"
                      ? row.score
                      : row.total_score}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
