import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from './pages/register/register';
import Home from './pages/home/home';
import Login from './pages/login/login';
import HallBooking from './pages/hall booking/hall booking';
import HallAvailable from "./pages/hall available/hall available";
import AdminLogin from './pages/admin login/admin login';
import AdminHome from './pages/admin home/admin home';
import AdminDashboard from './pages/admin dashboard/admin dashboard'; // Admin Dashboard component
import Feedback from './pages/feedback/feedback';

const App = () => {

  
  return (
    <Router>
          
           
      <Routes>
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register />} />
      <Route path="/home" element={<Home />} />
        <Route path="/hall-booking" element={<HallBooking />} />
        <Route path="/hall-available" element={<HallAvailable />} />
        <Route path="/admin login" element={<AdminLogin/>} />
        <Route path="/admin home" element={<AdminHome/>} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/feedback" element={<Feedback/>} />
      </Routes>
    </Router>
  );
};

export default App;
