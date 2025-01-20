import React from 'react';
import { FaUserCog, FaCommentDots } from 'react-icons/fa'; // Admin Dashboard and Feedback Icons
import { useNavigate } from 'react-router-dom'; // Import useNavigate from react-router-dom
import './admin home.css';
import bitLogoWord from '../../assets/bitlogo-word.png';
import Sidebar from "../../components/sidebar/sidebar";

const AdminHome = () => {
  const navigate = useNavigate(); // Initialize the navigate function

  // Function to handle navigation
  const navigateToPage = (page) => {
    if (page === 'dashboard') {
      navigate('/admin-dashboard'); // Navigate to Admin Dashboard
    } else if (page === 'feedback') {
      navigate('/feedback'); // Navigate to Feedback page
    }
  };

  return (
    <div className="adminhome-container">
        <Sidebar />
      <div className="bit-logo-center">
        <img src={bitLogoWord} alt="BIT Logo Word" className="bit-logo-word" />
      </div>

      <div className="options-container">
        {/* Admin Dashboard Option */}
        <div className="option-box" onClick={() => navigateToPage('dashboard')}>
          <FaUserCog className="option-icon" />
          <h3>Admin Dashboard</h3>
        </div>

        {/* Feedback Option */}
        <div className="option-box" onClick={() => navigateToPage('feedback')}>
          <FaCommentDots className="option-icon" />
          <h3>Feedback</h3>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
