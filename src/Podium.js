// import first from "./Images/1st-prize.png";
// import second from "./Images/2nd-place.png";
// import third from "./Images/3rd-place.png";

const Podium = ({ topThree }) => {
  return (
    <div className="podium-container">
      <div className="podium-position">
        <div className="second-place">
          {topThree[1]?.display_name || topThree[1]?.school_name}
        </div>

        <div className="podium podium-2">
          {" "}
          <div className="medal-icon second-place-icon">2</div>
          {/* <img src={second} alt="2nd Place" className="podium-image" /> */}
        </div>
      </div>
      <div className="podium-position">
        <div className="first-place">
          {topThree[0]?.display_name || topThree[0]?.school_name}
        </div>

        <div className="podium podium-1">
          {" "}
          <div className="medal-icon first-place-icon">1</div>
          {/* <img src={first} alt="1st Place" className="podium-image" /> */}
        </div>
      </div>
      <div className="podium-position">
        <div className="third-place">
          {topThree[2]?.display_name || topThree[2]?.school_name}
        </div>

        <div className="podium podium-3">
          <div className="medal-icon third-place-icon">3</div>
          {/* <img src={third} alt="3rd Place" className="podium-image" /> */}
        </div>
      </div>
    </div>
  );
};

export default Podium;
