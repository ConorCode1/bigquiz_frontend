function IOSInstallPrompt({ isVisible, onClose }) {
  return (
    <div className={`ios-install-modal ${isVisible ? "visible" : "hidden"}`}>
      <h2 className="ios-install-header">How To Install on IOS Devices</h2>

      <p className="ios-install-instruction">
        For full screen mode and access to all features, install the app with
        the below steps:
      </p>

      <p className="ios-install-instruction">
        <strong>1.</strong> Navigate to acecraft.ie in <strong>Safari</strong>.
      </p>
      <p className="ios-install-instruction">
        <strong>2.</strong> Tap the <strong>Share</strong> icon at the bottom of
        the Safari app.
      </p>
      <p className="ios-install-instruction">
        <strong>3.</strong> Scroll and tap <strong>Add to Home Screen</strong>.
      </p>
      <p className="ios-install-instruction">
        <strong>4.</strong> Then tap <strong>Add</strong> at the top right.
      </p>
      <button className="ios-install-close-btn" onClick={onClose}>
        Close
      </button>
    </div>
  );
}

export default IOSInstallPrompt;
