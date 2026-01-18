import React, { useState } from 'react';
import API from '../services/api';
import styles from './Login.module.css';  // Add this import

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post('/auth/login', form);
      localStorage.setItem('token', res.data.token);
      window.location = '/dashboard';
    } catch (err) {
      alert('Login failed');
    }
  };

  return (
    <div className={styles.container}>  {/* Apply container class */}
      <form className={styles.form} onSubmit={handleSubmit}>  {/* Apply form class */}
        <h2 className={styles.title}>Login</h2>  {/* Apply title class */}
        <input
          className={styles.input}  
          type="email"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          className={styles.input}  
          type="password"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button className={styles.button} type="submit">Login</button>  {/* Apply button class */}
        <p className={styles.link}>Don't have an account? <a href="/register">Register</a></p>  {/* Apply link class */}
      </form>
    </div>
  );
};

export default Login;