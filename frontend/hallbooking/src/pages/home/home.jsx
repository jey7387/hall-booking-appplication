import React, { useState } from 'react';
import Sidebar from '../../components/sidebar/sidebar';
import './home.css';
import bitLogoWord from '../../assets/bitlogo-word.png';

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  
  const togglePopup = () => {
    setIsPopupOpen(!isPopupOpen);
  };
  const handleSendFeedback = async () => {
    
    if (!feedbackMessage) {
      alert('Please enter feedback');
      return;
    }

  const userId = localStorage.getItem('userId');
  const userName = localStorage.getItem('userName');

  if (!userId || !userName) {
    alert('User information is missing. Please log in again.');
    return;
  }
    try {
      const response = await fetch('http://localhost:5000/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        
        body: JSON.stringify({
          userId,
          name: userName,
          message: feedbackMessage,
        }),
      });
      console.log(JSON.stringify({ userId, name: userName, message: feedbackMessage }));

      // Log the response for debugging
       console.log('Response:', response);
     
      if (response.ok) {
        alert('Feedback sent successfully!');
        setFeedbackMessage('');
        setIsPopupOpen(false);
      } else {
        const errorData = await response.json(); // Fetch error details
        console.error('Error Response:', errorData);
        alert('Failed to send feedback');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred while sending feedback');
    }
  };


  return (
    <div className="home-container">
      <Sidebar />
      <div className="bit-logo-center">
        <img src={bitLogoWord} alt="BIT Logo Word" className="bit-logo-word" />
      </div>
      <button className="feedback-btn" onClick={togglePopup}>
        Feedback
      </button>
      {isPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <button className="close-btn" onClick={togglePopup}>
              X
            </button>
            <h2 className="popup-heading">Feedback</h2>
            <textarea
              className="feedback-input"
              placeholder="Enter your feedback here..."
              value={feedbackMessage}
              onChange={(e) => setFeedbackMessage(e.target.value)}
            ></textarea>
            <button className="send-btn" onClick={handleSendFeedback}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
