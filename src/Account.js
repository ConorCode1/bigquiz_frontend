import React, { useState, useEffect } from "react";
import axios from "axios";
import { getAuth } from "firebase/auth";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import SearchableDropdown from "./SearchableDropdown";

const Account = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  const [updateMessage, setUpdateMessage] = useState("");
  const [county, setCounty] = useState(localStorage.getItem("county") || "");
  const [school, setSchool] = useState(
    localStorage.getItem("user_school") || ""
  );

  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [schoolIdMap, setSchoolIdMap] = useState({});

  localStorage.getItem("user_school", school);
  localStorage.getItem("county", county);

  const handleSignOut = () => {
    signOut(getAuth())
      .then(() => {
        navigate("/signup");
        localStorage.setItem("isSignedIn", "false");
      })
      .catch((error) => {
        console.error("Error signing out:", error);
      });
  };

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        const uid = user.uid;
        axios
          .get(`/getUser/${uid}`)
          .then((response) => {
            const userData = response.data;
            setName(userData.display_name);
            setEmail(userData.email);
          })
          .catch((error) => {
            console.error("Error fetching user data:", error);
          });
      }
    });

    return () => unsubscribe();
  }, []);

  const handleUpdate = () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const uid = user.uid;

      const selectedSchoolId = schoolIdMap[`${school}-${county}`];
      if (!selectedSchoolId) {
        setUpdateMessage("Invalid school selected");
        return;
      }

      axios
        .put(`/updateUser/${uid}`, {
          display_name: name,
          email: email,
          school_id: selectedSchoolId,
        })
        .then((response) => {
          // Set the update message and clear it after 3 seconds
          setUpdateMessage("Details updated successfully!");
          setTimeout(() => {
            setUpdateMessage("");
            localStorage.setItem("user_name", name);
            localStorage.setItem("user_school", school);
            localStorage.setItem("user_school_id", selectedSchoolId);
            localStorage.setItem("county", county);
          }, 3000);
        })
        .catch((error) => {
          console.error("Error updating user data:", error);
          // Optionally, set an error message
          setUpdateMessage("Error updating details. Please try again.");
          setTimeout(() => {
            setUpdateMessage("");
          }, 5000);
        });
    }
  };

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
    setFilteredSchools(schools.filter((s) => s.school_county === county));
  }, [county, schools]);

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
    <div className="account-container">
      <h2>Personal Details</h2>
      <div className="account-input-container">
        <div className="input-group">
          <label htmlFor="name">Username:</label>
          <input
            type="text"
            id="name"
            value={name}
            maxLength={10}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="input-group">
          <label htmlFor="name">County:</label>
          <SearchableDropdown
            options={alphabeticallySortedCounties}
            onSelect={handleCountySelect}
            placeholder={county}
            className="account-dropdown"
          />
        </div>
        <div className="input-group">
          <label htmlFor="name">School:</label>
          <SearchableDropdown
            options={alphabeticallySortedSchools}
            onSelect={handleSchoolSelect}
            placeholder={school}
            className="account-dropdown"
          />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            //   onChange={(e) => setEmail(e.target.value)}
            readOnly
          />
        </div>
      </div>
      <button className="update-btn" onClick={handleUpdate}>
        Update
      </button>
      {updateMessage && <span className="update-message">{updateMessage}</span>}
      <div className="seperator-line"></div>
      <button className="signout-btn" onClick={handleSignOut}>
        Sign Out
      </button>
    </div>
  );
};

export default Account;
