import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import StructuredData from "./StructuredData";
import "./firebaseConfig.js";

// Check if service workers are supported, and if so, register the service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function () {
    navigator.serviceWorker
      .register("/serviceworker.js")
      .then((registration) => {
        console.log(
          "Service worker registered successfully with scope: ",
          registration.scope
        );

        // Listen for messages from the service worker
        navigator.serviceWorker.addEventListener("message", (event) => {
          if (event.data && event.data.type === "NEW_VERSION") {
            window.location.reload();
          }
        });
      })
      .catch((error) => {
        console.log("Service worker registration failed:", error);
      });
  });
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <StructuredData />
    <App />
  </React.StrictMode>
);

reportWebVitals();
