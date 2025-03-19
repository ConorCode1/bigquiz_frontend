import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { HiArrowNarrowLeft, HiMenuAlt2 } from "react-icons/hi";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./Images/wrdlogo.png";
import { IoPersonCircleOutline } from "react-icons/io5";

const TopBar = () => {
  const location = useLocation();
  const [isSidebarOpen, setSidebarOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  const handleBackNavigation = () => {
    if (location.pathname.includes("quizSelection")) {
      localStorage.setItem("navigateFrom", "/");
      navigate("/");
    } else if (location.pathname.includes("quizChoice")) {
      const subject = localStorage.getItem("subject");
      if (subject) {
        localStorage.setItem("navigateFrom", "quizChoice");
        navigate(`/quizSelection/${subject}`);
      } else {
        localStorage.setItem("navigateFrom", "/");
        navigate("/");
      }
    } else {
      localStorage.setItem("navigateFrom", "quizChoice");
      navigate(-1);
    }
  };

  React.useEffect(() => {
    setSidebarOpen(false);
  }, []);

  return (
    <header className="app-header">
      {location.pathname !== "/" &&
      !location.pathname.includes("quizResult") &&
      !location.pathname.includes("newQ uizResult") &&
      !location.pathname.includes("about") &&
      !location.pathname.includes("moreinfo") &&
      !location.pathname.includes("signup") ? (
        <button className="back-button" onClick={handleBackNavigation}>
          <HiArrowNarrowLeft />
        </button>
      ) : null}

      {location.pathname === "placegolder " ? (
        // ||
        // location.pathname.includes("quizResult") ||
        // location.pathname.includes("about") ||
        // location.pathname.includes("signup")
        <button
          className="settings-button"
          onClick={(event) => {
            // event.stopPropagation();
            toggleSidebar();
          }}
        >
          <HiMenuAlt2 />
        </button>
      ) : null}
      <div className="navbar-brand logo">
        <img src={logo} alt="logo" className="logo-image" />
      </div>
      <button className="profile-button" onClick={() => navigate("/account")}>
        <IoPersonCircleOutline className="profile-icon" />
      </button>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={closeSidebar}
        customBurgerIcon={false}
      />
    </header>
  );
};

export default TopBar;
