import React, { useEffect, useState } from 'react';
import './feedback.css';
import { useNavigate } from 'react-router-dom';
const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('http://localhost:5000/feedback');
        console.log('Full response:', response); // Log the entire response object
        if (response.ok) {
          const data = await response.json();
          console.log('Fetched data:', data);
          setFeedbackData(data);
           

        } else {
            console.error(`Fetch failed with status ${response.status}: ${response.statusText}`);
        }
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  return (
    <div className="adminfeedback-container">
         <div className="adminback-icon" onClick={() => navigate('/admin home')}>
        &#8592; Back
      </div>
      <h1 className="adminfeedback-title">Feedback</h1>
      <div className="adminfeedback-table-wrapper">
        <table className="adminfeedback-table">
          <thead>
            <tr>
              <th>User ID</th>
              <th>Name</th>
              <th>Feedback</th>
            </tr>
          </thead>
          <tbody>
            {feedbackData.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.user_id}</td>
                <td>{feedback.name}</td>
                <td>{feedback.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Feedback;
