function ErrorFallbackUI() {
  const containerStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    flexDirection: "column",
    backgroundColor: "#09161f",
    fontFamily: "Arial, sans-serif",
  };

  const messageStyle = {
    fontSize: "1.5em",
    fontWeight: "600",
    marginBottom: "20px",
    color: "#ffffff",
  };

  const buttonStyle = {
    background: "linear-gradient(90deg, #667eea, #764ba2)",
    color: "#ffffff",
    border: "none",
    borderRadius: "5px",
    padding: "10px 20px",
    fontSize: "1em",
    boxShadow:
      "0px 4px 6px rgba(50, 50, 93, 0.11), 0px 1px 3px rgba(0, 0, 0, 0.08)",
    cursor: "pointer",
    transition: "all 0.2s",
    outline: "none",
  };

  return (
    <div style={containerStyle}>
      <p style={messageStyle}>Oops! Something went wrong.</p>
      <button style={buttonStyle} onClick={() => window.location.reload()}>
        Retry
      </button>
    </div>
  );
}

export default ErrorFallbackUI;
