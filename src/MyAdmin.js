import React, { useState, useEffect, useCallback } from "react";

const Admin = () => {
  const [signupStats, setSignupStats] = useState({
    today: 0,
    last7Days: 0,
    allTime: 0,
  });

  const [activeUserStats, setActiveUserStats] = useState({
    today: 0,
    yesterday: 0,
    last7Days: 0,
    last30Days: 0,
  });

  const [weeklySignups, setWeeklySignups] = useState([]);

  const [todaysSchoolSignups, setTodaysSchoolSignups] = useState([]);
  const [allTimeSchoolSignups, setAllTimeSchoolSignups] = useState([]);

  const getPastSevenDays = useCallback(() => {
    const dates = [];
    for (let i = 0; i <= 20; i++) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split("T")[0]); // Format as 'YYYY-MM-DD'
    }
    return dates; // This array will have dates in descending order
  }, []);

  const mergeWithFullWeek = useCallback(
    (signupData) => {
      const lastSevenDays = getPastSevenDays();
      return lastSevenDays.map((date) => {
        // Find matching date in signup data
        const foundDate = signupData.find((d) => {
          // Convert the date string from API to 'YYYY-MM-DD' format
          const formattedDate = new Date(d.signup_date)
            .toISOString()
            .split("T")[0];
          return formattedDate === date;
        });
        return {
          signup_date: date,
          signup_count: foundDate ? parseInt(foundDate.signup_count, 10) : 0,
        };
      });
    },
    [getPastSevenDays]
  );

  useEffect(() => {
    const fetchWeeklySignups = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getWeeklySignupStats`
        );
        const data = await response.json();
        console.log("API Data:", data); // Log the API data

        const mergedData = mergeWithFullWeek(data);
        setWeeklySignups(mergedData);
      } catch (error) {
        console.error("Error fetching weekly signups:", error);
      }
    };

    fetchWeeklySignups();
  }, [mergeWithFullWeek]);

  useEffect(() => {
    const fetchSignupStats = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getUserSignupStats`
        );
        const data = await response.json();
        setSignupStats(data);
      } catch (error) {
        console.error("Error fetching signup stats:", error);
      }
    };

    fetchSignupStats();
  }, []);

  useEffect(() => {
    const fetchTodaysSchoolSignups = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getTodaysSchoolSignupStats`
        );
        const data = await response.json();
        setTodaysSchoolSignups(data);
      } catch (error) {
        console.error("Error fetching today's school signups:", error);
      }
    };

    const fetchAllTimeSchoolSignups = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getAllTimeSchoolSignupStats`
        );
        const data = await response.json();
        setAllTimeSchoolSignups(data);
      } catch (error) {
        console.error("Error fetching all-time school signups:", error);
      }
    };

    fetchTodaysSchoolSignups();
    fetchAllTimeSchoolSignups();
  }, []);

  useEffect(() => {
    const fetchActiveUserStats = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/getActiveUserStats`
        );
        const data = await response.json();
        setActiveUserStats(data);
      } catch (error) {
        console.error("Error fetching active user stats:", error);
      }
    };

    fetchActiveUserStats();
  }, []);

  return (
    <div className="admin-dashboard">
      <p className="admin-title">New Users</p>
      <div className="stats-container">
        <div className="stat-tile">
          <p className="stat-title">Today</p>
          <p className="stat-value">{signupStats.today}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-title">Last 7 Days</p>
          <p className="stat-value">{signupStats.last7Days}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-title">All-Time</p>
          <p className="stat-value">{signupStats.allTime}</p>
        </div>
        <p className="admin-title">Active Users</p>
        <div className="stat-tile">
          <p className="stat-title">Today</p>
          <p className="stat-value">{activeUserStats.today}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-title">Yesterday</p>
          <p className="stat-value">{activeUserStats.yesterday}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-title">Last 7 Days</p>
          <p className="stat-value">{activeUserStats.last7Days}</p>
        </div>
        <div className="stat-tile">
          <p className="stat-title">Last 30 Days</p>
          <p className="stat-value">{activeUserStats.last30Days}</p>
        </div>
      </div>

      <div className="weekly-signups-table">
        <p className="admin-title">Daily Signups</p>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Signups</th>
            </tr>
          </thead>
          <tbody>
            {weeklySignups.map((signup, index) => (
              <tr key={index}>
                <td>{signup.signup_date}</td>
                <td>{signup.signup_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="weekly-signups-table">
        <p className="admin-title">Todays Signups</p>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>County</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {todaysSchoolSignups.map((signup, index) => (
              <tr key={index}>
                <td>{signup.school_name}</td>
                <td>{signup.school_county}</td>
                <td>{signup.signup_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="weekly-signups-table">
        <p className="admin-title">All-time Signups</p>
        <table>
          <thead>
            <tr>
              <th>School</th>
              <th>County</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {allTimeSchoolSignups.map((signup, index) => (
              <tr key={index}>
                <td>{signup.school_name}</td>
                <td>{signup.school_county}</td>
                <td>{signup.signup_count}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Admin;
