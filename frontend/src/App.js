import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TakeExam from './pages/TakeExam';
import Admin from './pages/Admin';
import CreateExam from './pages/CreateExam';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/exam/:id" element={<TakeExam />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/create-exam" element={<CreateExam />} />
      </Routes>
    </Router>
  );
}

export default App;