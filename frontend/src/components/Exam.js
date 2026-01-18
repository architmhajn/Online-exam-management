import React, { useState, useEffect, useRef } from 'react';
import WebcamMonitor from './WebcamMonitor';
import screenfull from 'screenfull';
import styles from './Exam.module.css';  // Add this import

const Exam = ({ exam, onSubmit }) => {
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(exam.duration * 60);
  const [cheatingFlags, setCheatingFlags] = useState([]);
  const examRef = useRef(null);

  useEffect(() => {
    if (screenfull.isEnabled) {
      screenfull.request(examRef.current);
      screenfull.on('change', () => {
        if (!screenfull.isFullscreen) {
          setCheatingFlags(prev => [...prev, 'fullscreenExit']);
        }
      });
    }

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setCheatingFlags(prev => [...prev, 'tabSwitch']);
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onSubmit(answers, cheatingFlags);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (screenfull.isEnabled) screenfull.exit();
    };
  }, [answers, cheatingFlags, onSubmit]);

  const shuffledQuestions = exam.randomizeQuestions ? [...exam.questions].sort(() => Math.random() - 0.5) : exam.questions;

  return (
    <div ref={examRef} className={styles.container}>  {/* Apply container class */}
      <WebcamMonitor onCheatingDetected={() => setCheatingFlags(prev => [...prev, 'webcamIssue'])} />
      <h2 className={styles.title}>{exam.title}</h2>  {/* Apply title class */}
      <p className={styles.timer}>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>  {/* Apply timer class */}
      {cheatingFlags.length > 0 && <p className={styles.cheating}>Cheating Detected: {cheatingFlags.join(', ')}</p>}  {/* Apply cheating class */}
      {shuffledQuestions.map((q, i) => (
        <div key={i} className={styles.question}>  {/* Apply question class */}
          <p>{q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j}>
              <input type="radio" name={`q${i}`} onChange={() => {
                const newAnswers = [...answers];
                newAnswers[i] = j;
                setAnswers(newAnswers);
              }} />
              <span className={styles.option}>{opt}</span>  {/* Apply option class */}
            </label>
          ))}
        </div>
      ))}
      <button className={styles.submitButton} onClick={() => onSubmit(answers, cheatingFlags)}>Submit</button>  {/* Apply submitButton class */}
    </div>
  );
};

export default Exam;