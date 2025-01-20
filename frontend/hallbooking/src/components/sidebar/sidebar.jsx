import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import './sidebar.css';
import { FaHome, FaCalendarAlt, FaUserCircle, FaSignOutAlt, FaUserCog} from 'react-icons/fa';
import bitLogo from '../../assets/bitlogo.png';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };
  const closeSidebar = () => {
    setIsOpen(false); // Close the sidebar when a link is clicked
  };

  // Close sidebar automatically when navigating
  useEffect(() => {
    const closeSidebar = () => setIsOpen(false);
    window.addEventListener('popstate', closeSidebar); // Listen for page navigation events

    return () => {
      window.removeEventListener('popstate', closeSidebar); // Clean up the event listener
    };
  }, []);

  return (
    <div>
      <button
        className={`nav-btn ${isOpen ? 'open' : ''}`}
        onClick={toggleSidebar}
      >
        &#9776;
      </button>
      <div className={`sidebar ${isOpen ? 'open' : ''}`}>
        {/* BIT Logo and Text inside the Sidebar */}
        <div className="sidebarlogo-container">
          <img src={bitLogo} alt="BIT Logo" className="sidebarbit-logo" />
          <span className="sidebarbit-text">BIT</span>
        </div>
        <ul>
          <li>
            <Link to="/home" onClick={closeSidebar}>
              <FaHome className="sidebar-icon" /> Home
            </Link>
          </li>
          <li>
            <Link to="/hall-booking" onClick={closeSidebar}>
              <FaCalendarAlt className="sidebar-icon" /> Hall Booking
            </Link>
          </li>
          <li>
            <Link to="/hall-available" onClick={closeSidebar}>
              <FaUserCircle className="sidebar-icon" /> Hall Availability
            </Link>
          </li>
          {/* Added Admin Option */}
          <li>
            <Link to="/admin login" onClick={closeSidebar}>
              <FaUserCog className="sidebar-icon" /> Admin
            </Link>
          </li>
         
          <li>
            <Link to="/login" onClick={closeSidebar}>
              <FaSignOutAlt className="sidebar-icon" /> Logout
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
