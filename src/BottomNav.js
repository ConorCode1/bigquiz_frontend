import React from "react";
import { Link, useLocation } from "react-router-dom";
import { HiMenuAlt2 } from "react-icons/hi";
// import { IoPersonCircleOutline } from "react-icons/io5";
// import { RiMedalLine } from "react-icons/ri";
import { MdOutlineLeaderboard } from "react-icons/md";
import { PiBooks } from "react-icons/pi";

function BottomNav({ openSidebar }) {
  // const isSignedIn = localStorage.getItem("isSignedIn") === "true";
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div className="bottom-nav">
      <Link to="/" className="nav-item">
        <div className="icon-container">
          <PiBooks
            className="bottom-icon"
            style={{ color: isActive("/") ? "#00a5e1" : "" }}
          />
          {/* <span>Home</span> */}
        </div>
      </Link>
      {/* <Link to={isSignedIn ? "/account" : "/signup"} className="nav-item">
        <div className="icon-container">
          <IoPersonCircleOutline
            className="bottom-icon"
            style={{
              color:
                isActive("/account") || isActive("/signup") ? "#057aff" : "",
            }}
          />
          <span>Profile</span>
        </div>
      </Link> */}
      {/* <Link to="badges" className="nav-item">
        <div className="icon-container">
          <RiMedalLine
            className="bottom-icon"
            style={{ color: isActive("/badges") ? "#057aff" : "" }}
          />
         
        </div>
      </Link> */}
      <Link to="leaderboard" className="nav-item">
        <div className="icon-container">
          <MdOutlineLeaderboard
            className="bottom-icon"
            style={{ color: isActive("/leaderboard") ? "#00a5e1" : "" }}
          />
          {/* <span>Leaderboard</span> */}
        </div>
      </Link>
      <div onClick={openSidebar} className="nav-item">
        <div className="icon-container">
          <HiMenuAlt2 className="bottom-icon" />
          {/* <span>More</span> */}
        </div>
      </div>
    </div>
  );
}

export default BottomNav;
