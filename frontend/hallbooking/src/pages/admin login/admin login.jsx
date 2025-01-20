import React, { useState } from 'react';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './admin login.css';  // Use a different CSS file for Admin Login if needed
import bitLogo from '../../assets/bitlogo.png';
import Sidebar from "../../components/sidebar/sidebar";
const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = 'Please enter the email.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!password.trim()) {
      newErrors.password = 'Please enter the password.';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});

      // Only allow this email and password combination
      if (email === 'jey@gmail.com' && password === '123') {
        alert('Login successful');
        navigate('/admin home'); // Navigate to the home page after successful login
      } else {
        alert('Invalid email or password');
      }
    }
  };

  return (
    <div className="adminlogin-container">
       <Sidebar />
      <div className="adminlogin-form">
        {/* BIT Logo and BIT Text */}
        <div className="adminbit-logo-container">
          <img src={bitLogo} alt="BIT Logo" className="bit-logo" />
          <span className="adminbit-text">BIT</span>
        </div>
        <h2>Admin Login</h2>
        <form onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
            {/* Error Message for Email */}
            {errors.email && <span className="adminerror-message">{errors.email}</span>}
          </div>

          {/* Password Input */}
          <div className="input-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
            {/* Error Message for Password */}
            {errors.password && <span className="adminerror-message">{errors.password}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="adminbtn-login">Login</button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
