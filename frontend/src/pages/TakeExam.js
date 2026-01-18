import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Exam from '../components/Exam';
import API from '../services/api';
import styles from './TakeExam.module.css';  // Add this import

const TakeExam = () => {
  const { id } = useParams();
  const [exam, setExam] = useState(null);

  useEffect(() => {
    API.get(`/exams/${id}`).then(res => setExam(res.data)).catch(() => alert('Exam not found'));
  }, [id]);

  const handleSubmit = (answers, cheatingFlags) => {
    API.post('/exams/submit', { examId: id, answers, cheatingFlags }).then(() => {
      alert('Exam submitted');
      window.location = '/dashboard';
    }).catch(() => alert('Submission failed'));
  };

  return exam ? <Exam exam={exam} onSubmit={handleSubmit} /> : <div className={styles.loading}><div className={styles.spinner}></div>Loading...</div>;  {/* Apply loading and spinner classes */}
};

export default TakeExam;