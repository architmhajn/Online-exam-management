import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import styles from './WebcamMonitor.module.css';  // Import the CSS module for styling

const WebcamMonitor = ({ onCheatingDetected }) => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate cheating detection (replace with real AI/ML logic if needed)
      if (Math.random() > 0.95) onCheatingDetected();
    }, 5000);
    return () => clearInterval(interval);
  }, [onCheatingDetected]);

  return (
    <Webcam
      ref={webcamRef}
      className={styles.webcam}  // Apply the 'webcam' class from the CSS module
      style={{ width: 320, height: 240 }}  // Fallback inline style if CSS doesn't load
    />
  );
};

export default WebcamMonitor;