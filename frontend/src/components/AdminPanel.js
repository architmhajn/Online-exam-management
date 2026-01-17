import React, { useState, useEffect } from 'react';
import API from '../services/api';

const AdminPanel = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    API.get('/admin/users').then(res => setUsers(res.data));
  }, []);

  const assignRole = (id, role) => {
    API.put(`/admin/assign-role/${id}`, { role }).then(() => alert('Role updated'));
  };

  const deleteUser = (id) => {
    API.delete(`/admin/users/${id}`).then(() => setUsers(users.filter(u => u.id !== id)));
  };

  return (
    <div>
      <h2>Admin Panel</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.name} - {user.role}</p>
          <select onChange={(e) => assignRole(user.id, e.target.value)}>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <button onClick={() => deleteUser(user.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default AdminPanel;