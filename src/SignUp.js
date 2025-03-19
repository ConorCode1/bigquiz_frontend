import React, { useState } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  // GoogleAuthProvider,
  // signInWithRedirect,
  // getRedirectResult,
} from "firebase/auth";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL =
  process.env.REACT_APP_API_URL || "http://localhost:5001";

function AuthComponent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (!email) {
      setErrorMessage("Email is required");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed up with Firebase successfully!");
      localStorage.setItem("isSignedIn", "true");
      localStorage.setItem("uid", user.uid);
      navigate("/moreinfo");

      // Save user details in your database
      try {
        const response = await axios.post("/saveUser", {
          uid: user.uid,
          email: user.email,
        });
        console.log("User saved in database:", response.data);
      } catch (dbError) {
        console.error("Error saving user in database:", dbError);
      }
    } catch (firebaseError) {
      // Check for "email already in use" error
      if (firebaseError.code === "auth/email-already-in-use") {
        console.log("Account already exists. Attempting to sign in...");

        // Attempt to sign in with provided email and password
        handleSignIn(e);
      } else {
        console.error("Error signing up with Firebase:", firebaseError);
        setErrorMessage(firebaseError.message);
      }
    }
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email) {
      setErrorMessage("Email is required");
      return;
    }
    if (!password) {
      setErrorMessage("Password is required");
      return;
    }
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      console.log("User signed in with Firebase successfully!");

      // Check if user exists in your database or save them if not
      try {
        const response = await axios.get(`/getUser/${user.uid}`);
        if (!response.data) {
          // If the user doesn't exist, save them
          await axios.post("/saveUser", {
            uid: user.uid,
            email: user.email,
          });
        }
        navigate("/");
        console.log("User checked in database:", response.data);
        localStorage.setItem("isSignedIn", "true");
        localStorage.setItem("uid", user.uid);
        localStorage.setItem("email", user.email);
      } catch (dbError) {
        console.error("Error checking user in database:", dbError);
      }
    } catch (firebaseError) {
      // Check for "user not found" error
      if (firebaseError.code === "auth/user-not-found") {
        setErrorMessage("Email not recognized. Please create an account.");
        setIsSignUp(true);
      }
      // Check for incorrect password error
      else if (firebaseError.code === "auth/wrong-password") {
        setErrorMessage("Incorrect password. Please try again.");
      } else {
        console.error("Error signing in with Firebase:", firebaseError);
        setErrorMessage(firebaseError.message);
      }
    }
  };

  // const handleGoogleSignIn = async () => {
  //   const provider = new GoogleAuthProvider();
  //   try {
  //     await signInWithRedirect(auth, provider);
  //     const userCredential = await getRedirectResult(auth);

  //     const user = userCredential.user;

  //     console.log("Google sign in successful!");

  //     // Check if user exists in your database or save them if not
  //     try {
  //       const response = await axios.get(`/getUser/${user.uid}`);
  //       if (!response.data) {
  //         // If the user doesn't exist, save them
  //         await axios.post("/saveUser", {
  //           uid: user.uid,
  //           email: user.email,
  //         });
  //       }
  //       console.log("User checked in database:", response.data);
  //     } catch (dbError) {
  //       console.error("Error checking user in database:", dbError);
  //     }
  //   } catch (firebaseError) {
  //     console.error("Error with Google sign in:", firebaseError);
  //   }
  // };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="sign_up_text">
          {isSignUp ? "Create Account" : "Sign In"}{" "}
        </div>
        <form onSubmit={isSignUp ? handleSignUp : handleSignIn}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            autoComplete="email"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
          />

          <button type="submit">
            {isSignUp ? "Create Account" : "Sign In"}
          </button>
        </form>
        <button className="switch-btn" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp ? "Or Sign In" : "Or Create Account"}
        </button>
        {/* <hr /> */}
        {/* <button className="google-btn" onClick={handleGoogleSignIn}>
          Sign in with Google
        </button> */}
        <div className="error-message" style={{ color: "red" }}>
          {errorMessage}
        </div>
      </div>
    </div>
  );
}

export default AuthComponent;
