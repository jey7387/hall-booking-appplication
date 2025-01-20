import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import './admin dashboard.css'; // Updated the CSS file name

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch users from the backend
  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Function to delete a user
  const handleDelete = (userId) => {
    fetch(`http://localhost:5000/users/${userId}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (response.ok) {
          // Remove user from the state
          setUsers(users.filter((user) => user.id !== userId));
        } else {
          console.error('Failed to delete the user.');
        }
      })
      .catch((err) => console.error(err));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="admin-dashboard-container">
      {/* Back Icon */}
      <div className="back-icon" onClick={() => navigate('/admin home')}>
        &#8592; Back
      </div>
      <h2 className="dashboard-title">User Data</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>User ID</th>
            <th>Name</th>
            <th>Email ID</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <button
                  className="delete-button"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  );
};

export default AdminDashboard;
