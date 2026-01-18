import React, { useState, useEffect } from 'react';
import API from '../services/api';
import styles from './Admin.module.css';  // Add this import

const Admin = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/admin/users').then(res => setUsers(res.data)).catch(() => {});
  }, []);

  const assignRole = (id, role) => {
    API.put(`/admin/assign-role/${id}`, { role }).then(() => alert('Role updated')).catch(() => alert('Failed'));
  };

  const deleteUser = (id) => {
    API.delete(`/admin/users/${id}`).then(() => setUsers(users.filter(u => u.id !== id))).catch(() => alert('Failed'));
  };

  return (
    <div className={styles.container}>  {/* Apply container class */}
      <div className={styles.panel}>  {/* Apply panel class */}
        <h2 className={styles.title}>Admin Panel</h2>  {/* Apply title class */}
        {users.map(user => (
          <div key={user.id} className={styles.user}>  {/* Apply user class */}
            <span>{user.name} - {user.role}</span>
            <select className={styles.select} onChange={(e) => assignRole(user.id, e.target.value)}>  {/* Apply select class */}
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="admin">Admin</option>
            </select>
            <button className={styles.deleteButton} onClick={() => deleteUser(user.id)}>Delete</button>  {/* Apply deleteButton class */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Admin;