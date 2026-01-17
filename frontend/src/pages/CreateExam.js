import React, { useState } from 'react';
import API from '../services/api';

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
    <div>
      <h2>Create Exam</h2>
      <input placeholder="Title" onChange={(e) => setExam({ ...exam, title: e.target.value })} required />
      <input placeholder="Course ID" onChange={(e) => setExam({ ...exam, courseId: e.target.value })} required />
      <input type="number" placeholder="Duration (min)" onChange={(e) => setExam({ ...exam, duration: parseInt(e.target.value) })} required />
      <button onClick={addQuestion}>Add Question</button>
      {exam.questions.map((q, i) => (
        <div key={i}>
          <input placeholder="Question" onChange={(e) => {
            const newQ = [...exam.questions];
            newQ[i].question = e.target.value;
            setExam({ ...exam, questions: newQ });
          }} required />
          {q.options.map((opt, j) => (
            <input key={j} placeholder={`Option ${j+1}`} onChange={(e) => {
              const newQ = [...exam.questions];
              newQ[i].options[j] = e.target.value;
              setExam({ ...exam, questions: newQ });
            }} required />
          ))}
          <select onChange={(e) => {
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
      <button onClick={handleSubmit}>Create Exam</button>
    </div>
  );
};

export default CreateExam;