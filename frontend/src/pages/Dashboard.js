import React, { useEffect, useState } from 'react';
import API from '../services/api';
import styles from './Dashboard.module.css';  // Add this import

const Dashboard = () => {
  const [role, setRole] = useState('');
  const [courses, setCourses] = useState([]);
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      setRole(decoded.role);
    }
    API.get('/courses').then(res => setCourses(res.data)).catch(() => {});
    API.get('/exams').then(res => setExams(res.data)).catch(() => {});
    if (role === 'student') {
      API.get('/exams/results').then(res => setResults(res.data)).catch(() => {});
    }
  }, [role]);

  return (
    <div className={styles.container}>  {/* Apply container class */}
      <h1 className={styles.title}>Dashboard - {role}</h1>  {/* Apply title class */}
      {role === 'admin' && <a className={styles.link} href="/admin">Admin Panel</a>}  {/* Apply link class */}
      {role === 'instructor' && (
        <div className={styles.section}>  {/* Apply section class */}
          <h2 className={styles.sectionTitle}>Your Courses</h2>  {/* Apply sectionTitle class */}
          {courses.map(c => (
            <div key={c.id} className={styles.item}>  {/* Apply item class */}
              <span>{c.name}</span>
              <a className={styles.link} href={`/create-exam?course=${c.id}`}>Create Exam</a>  {/* Apply link class */}
            </div>
          ))}
          <h2 className={styles.sectionTitle}>Your Exams</h2>  {/* Apply sectionTitle class */}
          {exams.map(e => (
            <div key={e.id} className={styles.item}>  {/* Apply item class */}
              <span>{e.title}</span>
              <a className={styles.link} href={`/exam/results/${e.id}`}>View Results</a>  {/* Apply link class */}
            </div>
          ))}
        </div>
      )}
      {role === 'student' && (
        <div className={styles.section}>  {/* Apply section class */}
          <h2 className={styles.sectionTitle}>Your Courses</h2>  {/* Apply sectionTitle class */}
          {courses.map(c => <p key={c.id}>{c.name}</p>)}
          <h2 className={styles.sectionTitle}>Available Exams</h2>  {/* Apply sectionTitle class */}
          {exams.map(e => (
            <div key={e.id} className={styles.item}>  {/* Apply item class */}
              <span>{e.title}</span>
              <a className={styles.link} href={`/exam/${e.id}`}>Take Exam</a>  {/* Apply link class */}
            </div>
          ))}
          <h2 className={styles.sectionTitle}>Your Results</h2>  {/* Apply sectionTitle class */}
          {results.map(r => <p key={r.id}>Exam: {r.examId} - Score: {r.score}</p>)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;