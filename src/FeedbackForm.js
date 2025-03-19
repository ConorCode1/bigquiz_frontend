import React, { useState } from "react";

const FeedbackForm = () => {
  const [message, setMessage] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const uid = localStorage.getItem("uid") || "Unknown";
  const [charsLeft, setCharsLeft] = useState(0);

  const handleTextChange = (e) => {
    setMessage(e.target.value);
    setCharsLeft(e.target.value.length); // Update remaining characters
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!message) {
      alert("Please enter your feedback before submitting.");
      return;
    }

    if (uid) {
      fetch(`${process.env.REACT_APP_API_URL}/postFeedback`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firebase_uid: uid,
          message: message,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data && data.success) {
            setIsSubmitted(true);
            setMessage(""); // Clear the message input
          }
        })
        .catch((error) => {
          console.error("Error posting feedback to backend:", error);
        });
    } else {
      alert("You need to be logged in to submit feedback.");
    }
  };

  return (
    <div className="master-feedback-container">
      <div className="feedback-title"> Contact</div>
      <div className="feedback-container">
        {isSubmitted ? (
          <p className="feedback-thankyou">Thank you for your feedback!</p>
        ) : (
          <form onSubmit={handleSubmit} className="feedback-form">
            <div className="feedback-input-group">
              <label htmlFor="message" className="feedback-label">
                Your Feedback:
              </label>
              <textarea
                id="message"
                value={message}
                onChange={handleTextChange}
                required
                className="feedback-textarea"
                maxLength={500}
              />
              <div className="char-count"> {charsLeft}/500</div>
            </div>
            <button type="submit" className="feedback-submit">
              Submit
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default FeedbackForm;
