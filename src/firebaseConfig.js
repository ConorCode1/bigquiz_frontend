import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyDEdOh8Txk8Tx8iyDn0j7YeahXnZxw1lNA",
  authDomain: "acecraft-4eb20.firebaseapp.com",
  projectId: "acecraft-4eb20",
  storageBucket: "acecraft-4eb20.appspot.com",
  messagingSenderId: "540775078251",
  appId: "1:540775078251:web:7c197be4e133bfbf7f142e",
  measurementId: "G-GKE1JYSQ5R",
};

let app;
let auth;
let analytics;

if (!window._firebaseInitialized) {
  app = initializeApp(firebaseConfig);
  auth = getAuth();
  analytics = getAnalytics(app);
  window._firebaseInitialized = true;
}

const handleAuthErrors = (error) => {
  const userErrorCodes = [
    "auth/wrong-password",
    "auth/user-not-found",
    "auth/user-disabled",
    // Add any other error codes that should be considered "user errors"
  ];

  if (!userErrorCodes.includes(error.code)) {
    const MAX_REFRESHES = 3;
    const refreshCount = parseInt(
      localStorage.getItem("refreshCount") || "0",
      10
    );

    if (refreshCount < MAX_REFRESHES) {
      localStorage.setItem("refreshCount", (refreshCount + 1).toString());
      window.location.reload();
    } else {
      localStorage.removeItem("refreshCount");
      console.error("Error encountered multiple times. Stopping auto-refresh.");
      // Consider showing a user-friendly error message here
    }
  }
};

onAuthStateChanged(auth, (user, error) => {
  if (error) {
    handleAuthErrors(error);
  } else {
    localStorage.removeItem("refreshCount"); // Reset the counter when everything is fine
  }
});

export { app, auth, analytics };
