import React, { useState } from 'react';
import { FaEnvelope, FaLock, FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './login.css';
import bitLogo from '../../assets/bitlogo.png';

const Login = () => {
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
      // Send login request to backend
      fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Backend Response:', data);
          if (data.token) {
            localStorage.setItem('token', data.token); // Store token in localStorage
            localStorage.setItem('userId', data.userId); // Store user ID
            
            localStorage.setItem('userName', data.userName); // Store user name
            console.log('User ID stored:', data.userId); // Log the user ID for verification
            console.log('login token', data.token); 
            alert('Login successful');
            navigate('/home'); // Navigate to the home page after successful login
          } else {
            alert(data.error || 'Login failed');
          }
        })
        .catch((err) => console.error(err));
    }
  };

  

  return (
    <div className="login-container">
      <div className="login-form">
        {/* BIT Logo and BIT Text */}
        <div className="bit-logo-container">
          <img src={bitLogo} alt="BIT Logo" className="bit-logo" />
          <span className="bit-text">BIT</span>
        </div>
        <h2>Login</h2>
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
            {errors.email && <span className="error-message">{errors.email}</span>}
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
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn-login">Login</button>
        </form>
        <a href="/register" className="sign-up-link">
          <FaUserCircle className="input-icon" /> Don't have an account? <span>Sign up</span>
        </a>
      </div>
    </div>
  );
};

export default Login;
