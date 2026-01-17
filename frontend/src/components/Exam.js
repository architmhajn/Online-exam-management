import React, { useState, useEffect, useRef } from 'react';
import WebcamMonitor from './WebcamMonitor';
import screenfull from 'screenfull';

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
    <div ref={examRef} style={{ width: '100vw', height: '100vh' }}>
      <WebcamMonitor onCheatingDetected={() => setCheatingFlags(prev => [...prev, 'webcamIssue'])} />
      <h2>{exam.title}</h2>
      <p>Time Left: {Math.floor(timeLeft / 60)}:{timeLeft % 60}</p>
      {cheatingFlags.length > 0 && <p style={{ color: 'red' }}>Cheating Detected: {cheatingFlags.join(', ')}</p>}
      {shuffledQuestions.map((q, i) => (
        <div key={i}>
          <p>{q.question}</p>
          {q.options.map((opt, j) => (
            <label key={j}>
              <input type="radio" name={`q${i}`} onChange={() => {
                const newAnswers = [...answers];
                newAnswers[i] = j;
                setAnswers(newAnswers);
              }} />
              {opt}
            </label>
          ))}
        </div>
      ))}
      <button onClick={() => onSubmit(answers, cheatingFlags)}>Submit</button>
    </div>
  );
};

export default Exam;