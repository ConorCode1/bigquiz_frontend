import React from "react";
import { Link, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NavigationBar = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-light bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Your Logo
        </Link>
        <ul className="navbar-nav">
          {location.pathname !== "/quizselection" && (
            <li className="nav-item">
              <Link to="/quizselection" className="nav-link">
                Quiz Selection
              </Link>
            </li>
          )}
          {/* Add more navigation links as needed */}
        </ul>
      </div>
    </nav>
  );
};

export default NavigationBar;
