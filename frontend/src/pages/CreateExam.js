import React, { useState } from 'react';
import API from '../services/api';
import styles from './CreateExam.module.css';  // Add this import

const CreateExam = () => {
  const [exam, setExam] = useState({ title: '', courseId: '', questions: [], duration: 60, randomizeQuestions: true });

  const addQuestion = () => {
    setExam({ ...exam, questions: [...exam.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }] });
  };

  const handleSubmit = () => {
    API.post('/exams', exam).then(() => {
      alert('Exam created');
      window.location = '/dashboard';
    }).catch(() => alert('Creation failed'));
  };

  return (
    <div className={styles.container}>  {/* Apply container class */}
      <div className={styles.form}>  {/* Apply form class */}
        <h2 className={styles.title}>Create Exam</h2>  {/* Apply title class */}
        <input className={styles.input} placeholder="Title" onChange={(e) => setExam({ ...exam, title: e.target.value })} required />  {/* Apply input class */}
        <input className={styles.input} placeholder="Course ID" onChange={(e) => setExam({ ...exam, courseId: e.target.value })} required />  {/* Apply input class */}
        <input className={styles.input} type="number" placeholder="Duration (min)" onChange={(e) => setExam({ ...exam, duration: parseInt(e.target.value) })} required />  {/* Apply input class */}
        <button className={styles.button} onClick={addQuestion}>Add Question</button>  {/* Apply button class */}
        {exam.questions.map((q, i) => (
          <div key={i} className={styles.question}>  {/* Apply question class */}
            <input className={styles.input} placeholder="Question" onChange={(e) => {
              const newQ = [...exam.questions];
              newQ[i].question = e.target.value;
              setExam({ ...exam, questions: newQ });
            }} required />
            {q.options.map((opt, j) => (
              <input key={j} className={styles.input} placeholder={`Option ${j+1}`} onChange={(e) => {
                const newQ = [...exam.questions];
                newQ[i].options[j] = e.target.value;
                setExam({ ...exam, questions: newQ });
              }} required />
            ))}
            <select className={styles.select} onChange={(e) => {
              const newQ = [...exam.questions];
              newQ[i].correctAnswer = parseInt(e.target.value);
              setExam({ ...exam, questions: newQ });
            }}>
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
          </div>
        ))}
        <button className={styles.button} onClick={handleSubmit}>Create Exam</button>  {/* Apply button class */}
      </div>
    </div>
  );
};

export default CreateExam;