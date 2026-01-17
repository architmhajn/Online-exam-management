import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';

const WebcamMonitor = ({ onCheatingDetected }) => {
  const webcamRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.95) onCheatingDetected();
    }, 5000);
    return () => clearInterval(interval);
  }, [onCheatingDetected]);

  return <Webcam ref={webcamRef} style={{ width: 320, height: 240 }} />;
};

export default WebcamMonitor;