import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import SearchableDropdown from "./SearchableDropdown";
import { BAD_WORDS } from "./constants";

function containsBadWord(text) {
  const lowerCaseText = text.toLowerCase();
  for (const word of BAD_WORDS) {
    if (lowerCaseText.includes(word)) return true;
  }
  return false;
}

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5001";

function YourDetails() {
  const generateRandomNumber = () => {
    return Math.floor(Math.random() * 900000) + 100000; // Generates a number between 100000 and 999999
  };
  const [name, setName] = useState("");
  const [county, setCounty] = useState("");
  const [school, setSchool] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolIdMap, setSchoolIdMap] = useState({});
  const [isSuccess, setIsSuccess] = useState(false);
  // const [isLaterAction, setIsLaterAction] = useState(false);

  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await axios.get("/getSchools");
        setSchools(response.data);

        // Populate the schoolIdMap with name+county as the key
        const newSchoolIdMap = {};
        response.data.forEach((school) => {
          const key = `${school.school_name}-${school.school_county}`;
          newSchoolIdMap[key] = school.school_id;
        });
        setSchoolIdMap(newSchoolIdMap);
      } catch (error) {
        console.error("Error fetching schools:", error);
      }
    };
    fetchSchools();
  }, []);

  useEffect(() => {
    // Filter schools based on the selected county
    setFilteredSchools(schools.filter((s) => s.school_county === county));
  }, [county, schools]);

  const handleLater = () => {
    const randomUsername = `user${generateRandomNumber()}`;
    setName(randomUsername);
    setSchool("Other");
    setCounty("Other");
    // setIsLaterAction(true);
    submitDetails(randomUsername, "Other", "Other", 1455); // Assuming 1455 is the ID for 'Other'
  };

  const submitDetails = async (name, county, school, schoolId) => {
    try {
      const response = await axios.put(`/updateUser/${uid}`, {
        display_name: name,
        school_id: schoolId,
      });

      console.log("User details updated:", response.data);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        navigate("/");
        localStorage.setItem("user_name", name);
        localStorage.setItem("user_school", school);
        localStorage.setItem("user_school_id", schoolId);
        localStorage.setItem("county", county);
      }, 1000);
    } catch (error) {
      console.error("Error updating user details:", error);
      setErrorMessage("Error updating details. Please try again.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (containsBadWord(name)) {
      setErrorMessage("Please avoid using inappropriate words.");
      return;
    }

    if (!name || !county || !school) {
      setErrorMessage("All fields are required");
      return;
    }

    const selectedSchoolId = schoolIdMap[`${school}-${county}`];
    if (!selectedSchoolId) {
      setErrorMessage("Invalid school selected");
      return;
    }

    submitDetails(name, county, school, selectedSchoolId);
  };

  // const handleSubmit = async (e) => {
  //   if (e) {
  //     e.preventDefault();
  //   }

  //   if (!isLaterAction) {
  //     if (containsBadWord(name)) {
  //       setErrorMessage("Please avoid using inappropriate words.");
  //       return;
  //     }

  //     if (!name || !county || !school) {
  //       setErrorMessage("All fields are required");
  //       return;
  //     }
  //   }

  //   const selectedSchoolId = isLaterAction
  //     ? 1455 // Assuming 1455 is the ID for 'Other'
  //     : schoolIdMap[`${school}-${county}`];

  //   if (!isLaterAction && !selectedSchoolId) {
  //     setErrorMessage("Invalid school selected");
  //     return;
  //   }

  //   try {
  //     const response = await axios.put(`/updateUser/${uid}`, {
  //       display_name: name,
  //       school_id: selectedSchoolId,
  //     });

  //     console.log("User details updated:", response.data);
  //     setIsSuccess(true);
  //     setTimeout(() => {
  //       setIsSuccess(false);
  //       navigate("/");
  //       localStorage.setItem("user_name", name);
  //       localStorage.setItem("user_school", school);
  //       localStorage.setItem("user_school_id", selectedSchoolId);
  //       localStorage.setItem("county", county);
  //     }, 1000);
  //   } catch (error) {
  //     console.error("Error updating user details:", error);
  //     setErrorMessage("Error updating details. Please try again.");
  //   }

  //   setIsLaterAction(false);
  // };

  const handleCountySelect = (selectedCounty) => {
    setCounty(selectedCounty);
  };

  const handleSchoolSelect = (selectedSchool) => {
    setSchool(selectedSchool);
  };

  const alphabeticallySortedCounties = [
    ...new Set(schools.map((s) => s.school_county)),
  ].sort();
  const alphabeticallySortedSchools = filteredSchools
    .map((s) => s.school_name)
    .sort();

  return (
    <div className="auth-container">
      {isSuccess && (
        <div className="success-message">Profile Created Succesfully!</div>
      )}
      <div className="auth-form">
        <h1 className="moreinfo-header">Create Your Profile</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Username"
            required
            maxLength={10}
          />
          <SearchableDropdown
            options={alphabeticallySortedCounties}
            onSelect={handleCountySelect}
            placeholder="Select your county"
          />
          <SearchableDropdown
            options={alphabeticallySortedSchools}
            onSelect={handleSchoolSelect}
            placeholder="Select your school"
          />
          <button type="submit">Save</button>

          <button type="button" onClick={handleLater} className="later-button">
            I'll do it later
          </button>
        </form>

        <div className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </div>
      </div>
    </div>
  );
}

export default YourDetails;
