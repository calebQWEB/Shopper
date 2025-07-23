"use client";
import { useState, useEffect } from "react";

const VisibilityWrapper = ({ children }) => {
  const [isVisible, setIsVisible] = useState(true);
  let inactivityTimer;

  const handleMouseMove = () => {
    clearTimeout(inactivityTimer);
    setIsVisible(true);

    // Start a timer to hide elements after inactivity
    inactivityTimer = setTimeout(() => {
      setIsVisible(false);
    }, 3000); // Adjust inactivity delay as needed
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(inactivityTimer);
    };
  }, []);

  return (
    <div
      className={`relative transition-opacity duration-500 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
    >
      {children}
    </div>
  );
};

export default VisibilityWrapper;
