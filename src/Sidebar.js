import React, { useEffect } from "react";
import { slide as Menu } from "react-burger-menu";
import { MdInstallMobile } from "react-icons/md";
import {
  IoClose,
  IoHome,
  IoInformationCircle,
  IoReader,
} from "react-icons/io5";
import { BsPersonFill } from "react-icons/bs";
import { FaEnvelope } from "react-icons/fa";
import { FaTiktok, FaInstagram } from "react-icons/fa";

import IOSInstallPrompt from "./IosInstallModal";

let deferredPrompt;

// const isSignedIn = localStorage.getItem("isSignedIn") === "true";

const handleInstallClick = async () => {
  if (!deferredPrompt) return;

  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;

  if (outcome === "accepted") {
    console.log("User accepted the install prompt");
  } else {
    console.log("User dismissed the install prompt");
  }

  deferredPrompt = null;
};

function isIOS() {
  return (
    [
      "iPad Simulator",
      "iPhone Simulator",
      "iPod Simulator",
      "iPad",
      "iPhone",
      "iPod",
    ].includes(navigator.platform) ||
    (navigator.userAgent.includes("Mac") && "ontouchend" in document)
  );
}

function Sidebar({ isOpen, onClose }) {
  // // const [isSignedIn, setIsSignedIn] = useState(
  //   localStorage.getItem("isSignedIn") === "true"
  // );

  // useEffect(() => {
  //   // Function to update isSignedIn state based on localStorage
  //   // const updateSignedInStatus = () => {
  //   //   setIsSignedIn(localStorage.getItem("isSignedIn") === "true");
  //   // };
  //   // Listen for changes in localStorage
  //   // window.addEventListener("storage", updateSignedInStatus);
  //   // // Cleanup the listener when the component is unmounted
  //   // return () => {
  //   //   window.removeEventListener("storage", updateSignedInStatus);
  //   // };
  // }, []);
  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // e.preventDefault();
      deferredPrompt = e;
      const installButton = document.getElementById("installButton");
      if (installButton) {
        installButton.style.display = "block";
      }
    });

    window.addEventListener("appinstalled", () => {
      console.log("App installed successfully!");
      const installButton = document.getElementById("installButton");
      if (installButton) {
        installButton.style.display = "none";
      }
    });
  }, []);

  const [showIOSModal, setShowIOSModal] = React.useState(false);

  const handleIOSInstallClick = () => {
    setShowIOSModal(true);
    onClose();
  };

  return (
    <>
      <Menu
        isOpen={isOpen}
        onStateChange={({ isOpen: newState }) => {
          if (!newState) {
            onClose();
          }
        }}
        styles={{ bmMenu: { height: "100vh" } }}
      >
        <button className="bm-item sidebar-close-button" onClick={onClose}>
          <IoClose />
        </button>
        <a href="/" className="menu-item">
          <IoHome className="menu-icon" />
          <span>Home</span>
        </a>
        <a
          href={
            localStorage.getItem("isSignedIn") === "true"
              ? "/account"
              : "/signup"
          }
          className="menu-item"
        >
          <BsPersonFill className="menu-icon" />
          <span>Profile</span>
        </a>

        <a href="/about" className="menu-item">
          <IoInformationCircle className="menu-icon" />
          <span>About</span>
        </a>
        <a href="/contact" className="menu-item">
          <FaEnvelope className="menu-icon" />
          <span>Contact</span>
        </a>
        <a href="/legal" className="menu-item">
          <IoReader className="menu-icon" />
          <span>Legal</span>
        </a>

        <a
          href="https://www.tiktok.com/@educadelearning"
          className="menu-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTiktok className="menu-icon" />
          <span>TikTok</span>
        </a>
        <a
          href="https://www.instagram.com/educadelearning/"
          className="menu-item"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram className="menu-icon" />
          <span>Instagram</span>
        </a>

        <button
          className="bm-item menu-item"
          id="installButton"
          onClick={handleInstallClick}
          // style={{ display: "none", cursor: "pointer" }}
          // style={{ cursor: "pointer" }}
        >
          <MdInstallMobile className="menu-icon" />
          <span>Install App</span>
        </button>
        {isIOS() && (
          <button className="bm-item menu-item" onClick={handleIOSInstallClick}>
            <MdInstallMobile className="menu-icon" />
            <span>Install App IOS</span>
          </button>
        )}
      </Menu>
      <IOSInstallPrompt
        isVisible={showIOSModal}
        onClose={() => setShowIOSModal(false)}
      />
    </>
  );
}

export default Sidebar;
