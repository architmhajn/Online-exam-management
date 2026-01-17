import React from "react";
import { Link } from "react-router-dom";


function Home() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Online Exam Management System</h1>

      <div style={styles.buttonWrapper}>
        <Link to="/login" style={styles.button}>Login</Link>
        <Link to="/register" style={styles.button}>Register</Link>
      </div>
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
    fontSize: "2.5rem",
    marginBottom: "20px"
  },
  buttonWrapper: {
    display: "flex",
    gap: "20px"
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#4CAF50",
    color: "white",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "18px"
  }
};

export default Home;
