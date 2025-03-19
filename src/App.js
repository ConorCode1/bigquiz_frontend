import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import { BrowserRouter as Router } from "react-router-dom";
import TopBar from "./topBar";
import "./App.css";
// import StarryBackground from "./StarryBg";
import ErrorBoundary from "./ErrorBoundary";
import ErrorFallbackUI from "./ErrorFallbackUI";
import MainContent from "./MainContent"; // Make sure the path is correct

function App() {
  useEffect(() => {
    const timer = setTimeout(() => {
      const keyElement = document.querySelector(".app-header");
      if (!keyElement) {
        window.location.reload();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <Router>
      {/* <StarryBackground /> */}
      <ErrorBoundary FallbackComponent={ErrorFallbackUI}>
        <TopBar />
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <MainContent setIsSidebarOpen={setIsSidebarOpen} />
      </ErrorBoundary>
    </Router>
  );
}

export default App;
