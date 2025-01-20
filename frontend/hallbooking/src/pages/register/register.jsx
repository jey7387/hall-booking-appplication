import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Import Link and useNavigate
import './register.css'; // Import the CSS for styling
import bitLogo from '../../assets/bitlogo.png'; // Import the BIT logo from assets
import { FaUser, FaEnvelope, FaLock, FaPhone } from 'react-icons/fa'; // Import relevant icons

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Validate Form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Please enter your full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Please enter your email.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Please create a strong password.';
    }

    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Please enter your phone number.';
    } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be 10 digits.';
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({});
      // Send data to backend API
      fetch('http://localhost:5000/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            alert('Registration successful');
            navigate('/login');
          } else {
            alert(data.error || 'Registration failed');
          }
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="register-container">
      <div className="register-form-wrapper">
        {/* BIT Logo and Text */}
        <div className="registerlogo-container">
          <img src={bitLogo} alt="BIT Logo" className="registerbit-logo" />
          <span className="registerbit-text">BIT</span>
        </div>

        <h2>Sign Up</h2>
        <form onSubmit={handleSubmit} className="register-form">
          {/* Name Input */}
          <div className="registerform-group">
            <label htmlFor="name">Name</label>
            <div className="registerinput-with-icon">
              <FaUser className="registerform-icon" />
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
            {errors.name && <span className="registererror-message">{errors.name}</span>}
          </div>

          {/* Email Input */}
          <div className="registerform-group">
            <label htmlFor="email">Email</label>
            <div className="registerinput-with-icon">
              <FaEnvelope className="registerform-icon" />
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <span className="registererror-message">{errors.email}</span>}
          </div>

          {/* Password Input */}
          <div className="registerform-group">
            <label htmlFor="password">Password</label>
            <div className="registerinput-with-icon">
              <FaLock className="registerform-icon" />
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Create a strong password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            {errors.password && <span className="registererror-message">{errors.password}</span>}
          </div>

          {/* Confirm Password Input */}
          <div className="registerform-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="registerinput-with-icon">
              <FaLock className="registerform-icon" />
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>
            {errors.confirmPassword && <span className="registererror-message">{errors.confirmPassword}</span>}
          </div>

          {/* Phone Number Input */}
          <div className="registerform-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <div className="registerinput-with-icon">
              <FaPhone className="registerform-icon" />
              <input
                type="text"
                id="phoneNumber"
                name="phoneNumber"
                placeholder="Enter your phone number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            {errors.phoneNumber && <span className="registererror-message">{errors.phoneNumber}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="registersubmit-btn">Sign Up</button>
        </form>

        {/* Already have an account? Link to Login */}
        <p className="registerlogin-link">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
