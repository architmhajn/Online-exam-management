import React, { useState } from "react";
import axios from "axios";


function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/register", formData);
      alert("Registration successful!");
    } catch (error) {
      console.error(error);
      alert("Registration failed.");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Create an Account</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>Register</button>
      </form>
    </div>
  );
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5"
  },
  title: {
    fontSize: "2rem",
    marginBottom: "20px"
  },
  form: {
    background: "white",
    padding: "30px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "300px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)"
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc"
  },
  button: {
    padding: "10px",
    fontSize: "18px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
  }
};

export default Register;
