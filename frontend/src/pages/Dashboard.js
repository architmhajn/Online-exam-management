import React, { useEffect, useState } from 'react';
import API from '../services/api';

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
    API.get('/courses').then(res => setCourses(res.data));
    API.get('/exams').then(res => setExams(res.data)); // Assuming a new endpoint for exams
    if (role === 'student') {
      API.get('/exams/results').then(res => setResults(res.data)); // Student results
    }
  }, [role]);

  return (
    <div>
      <h1>Dashboard - {role}</h1>
      {role === 'admin' && <a href="/admin">Admin Panel</a>}
      {role === 'instructor' && (
        <div>
          <h2>Your Courses</h2>
          {courses.map(c => <p key={c.id}>{c.name} - <a href={`/exam/create?course=${c.id}`}>Create Exam</a></p>)}
          <h2>Your Exams</h2>
          {exams.map(e => <p key={e.id}>{e.title} - <a href={`/exam/results/${e.id}`}>View Results</a></p>)}
        </div>
      )}
      {role === 'student' && (
        <div>
          <h2>Your Courses</h2>
          {courses.map(c => <p key={c.id}>{c.name}</p>)}
          <h2>Available Exams</h2>
          {exams.map(e => <p key={e.id}>{e.title} - <a href={`/exam/${e.id}`}>Take Exam</a></p>)}
          <h2>Your Results</h2>
          {results.map(r => <p key={r.id}>Exam: {r.examId} - Score: {r.score}</p>)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;