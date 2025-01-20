import React, { useState, useEffect } from "react";
import Sidebar from "../../components/sidebar/sidebar";
import bitLogo from "../../assets/bitlogo.png";
import "./hall booking.css";

const HallBooking = () => {

  const [formData, setFormData] = useState({
    hall: "",
    date: "",
    purpose: "",
    slots: [], // Changed from single slot to an array
  });
  const [bookings, setBookings] = useState([]);
  const [currentUser] = useState(null); // State to store current user information

  // Fetch current user info (could be from API or localStorage)
  useEffect(() => {
    const fetchAllBookings = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token found. Please log in.");
        }
  
        const response = await fetch("http://localhost:5000/api/all-bookings", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`, // Include admin token if needed
            "Content-Type": "application/json",
          },
        });
  
        const text = await response.text();
        console.log("All Bookings Response:", text);
  
        if (!response.ok) {
          throw new Error(`Failed to fetch bookings: ${text}`);
        }
  
        const data = JSON.parse(text);
        setBookings(data);
      } catch (error) {
        console.error("Error fetching all bookings:", error.message);
      }
    };
  
    fetchAllBookings();
  }, []);
  
  

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSlotClick = (slot) => {
    setFormData((prevData) => {
      const slots = prevData.slots.includes(slot)
        ? prevData.slots.filter((s) => s !== slot) // Remove slot if already selected
        : [...prevData.slots, slot]; // Add slot if not already selected
      return { ...prevData, slots };
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const token = localStorage.getItem("token");
    console.log('JWT Token:',localStorage.getItem("token"));

   
  
    try {
      const formattedDate = new Date(formData.date).toISOString().split("T")[0]; // Convert to YYYY-MM-DD

      const response = await fetch("http://localhost:5000/api/bookings", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hall: formData.hall,
          date: formattedDate,
          slots: formData.slots,
          purpose: formData.purpose,
        }),
      });

      console.log('Response Status:', response.status); // Debug log
  
      // Check for HTTP errors
      if (!response.ok) {
        const text = await response.text(); // Read raw text response
        console.error('Error Response Text:', text); // Debug log
        const errorData = await response.json();
        console.error("Error submitting booking:", errorData);
        return;
      }
  
      const data = await response.json();
      console.log('Booking Response:', data); // Debug log
      console.log("Booking successful:", data);
  
      // Update the state with the new booking
      setBookings((prevBookings) => [...prevBookings, data]);
      setFormData({ hall: "", date: "", purpose: "", slots: [] });

      // Scroll to the form after successful booking
      
       // Scroll to the latest booking
    setTimeout(() => {
      const tableContainer = document.querySelector(".hall-booking-details");
      tableContainer.scrollTop = tableContainer.scrollHeight;
    }, 100);
    } catch (error) {
      console.error("Error submitting booking:",error.message);
    }
  };
  
  const isFormComplete =
    formData.hall && formData.date && formData.purpose && formData.slots.length > 0;

    const handleDelete = (bookingId) => {
      const token = localStorage.getItem('token');
      console.log('Retrieved Token:', token);
    
      fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json' // Ensure JSON headers
        },
        credentials: 'include' // Include authentication credentials
      })
      .then(async (response) => {
        const text = await response.text(); // Read response as text
        try {
          return JSON.parse(text); // Attempt to parse as JSON
        } catch {
          return text; // If parsing fails, return raw text
        }
      })
      .then((data) => {
        console.log("Delete Response:", data); // Log response
    
        if (typeof data === 'string') {
          console.error("Server did not return JSON:", data);
          return;
        }

    if (data.error) {
      alert(data.error); // Show error message if unauthorized
      return;
    }

    
        // Remove deleted booking from state
        setBookings((prevBookings) => prevBookings.filter((booking) => booking.id !== bookingId));
        alert("Booking deleted successfully!");
      })
      .catch((error) => console.error("Error deleting booking:", error));
    };
    
  // Disable slots that are already booked for the selected date
  const disabledSlots = bookings
    .filter((booking) => booking.date === formData.date && booking.hall === formData.hall)
    .flatMap((booking) => booking.slots);
    console.log("Disabled Slots:", disabledSlots);
    


  return (
    <div className="hall-booking-page">
      <Sidebar />
      <div className="hall-booking-container">
        {/* Left Side: Booking Form */}
        <div className="hall-booking-form" >
          <header className="header">
            <img src={bitLogo} alt="BIT Logo" className="header-logo" />
            <h1 className="header-title">Hall Booking System</h1>
          </header>
          <form className="booking-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="hall">Select Hall:</label>
              <select
                id="hall"
                className="form-control"
                value={formData.hall}
                onChange={handleInputChange}
              >
                <option value="">Select a Hall</option>
                <option value="Main Auditorium">Main Auditorium</option>
                <option value="Vedhanayagam Auditorium">Vedhanayagam Auditorium</option>
                <option value="ECE Seminar Hall">ECE Seminar Hall</option>
                <option value="SF Seminar Hall">SF Seminar Hall</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="date">Select Date:</label>
              <input
                type="date"
                id="date"
                className="form-control"
                value={formData.date}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="purpose">Purpose:</label>
              <input
                type="text"
                id="purpose"
                className="form-control"
                placeholder="Enter the Purpose"
                value={formData.purpose}
                onChange={handleInputChange}
              />
            </div>
            <div className="time-slots">
              <h2 className="time-slot-title">Forenoon:</h2>
              <div className="time-slot-group">
                {[
                  "8:30 - 9:00", "9:00 - 9:30", "9:30 - 10:00", "10:00 - 10:30",
                  "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30",
                ].map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot ${
                      formData.slots.includes(slot) ? "selected" : disabledSlots.includes(slot) ? "disabled" : ""
                    }`}
                    onClick={() => !disabledSlots.includes(slot) && handleSlotClick(slot)}
                       disabled={disabledSlots.includes(slot)}
                       title={disabledSlots.includes(slot) ? "This slot is already booked" : ""}
                  >
                    {slot}
                  </button>
                ))}
              </div>
               
              <h2 className="time-slot-title">Afternoon:</h2>
              <div className="time-slot-group">
                {[
                  "1:00 - 1:30", "1:30 - 2:00", "2:00 - 2:30", "2:30 - 3:00",
                  "3:00 - 3:30", "3:30 - 4:00", "4:00 - 4:30", "after 4:30",
                ].map((slot) => (
                  <button
                    type="button"
                    key={slot}
                    className={`time-slot ${
                      formData.slots.includes(slot) ? "selected" : disabledSlots.includes(slot) ? "disabled" : ""
                    }`}
                    onClick={() => !disabledSlots.includes(slot) && handleSlotClick(slot)}
                       disabled={disabledSlots.includes(slot)}
                       
                       
                       title={disabledSlots.includes(slot) ? "This slot is already booked" : ""}
                       
                  >
                    {slot}
                  </button>
                  
                ))}
              </div>
            </div>
            <button type="submit" className="book-now" disabled={!isFormComplete}>
              Book Now
            </button>
          </form>
        </div>

        {/* Right Side: Booking Table */}
        <div className="hall-booking-details">
          <table className="booking-table">
            <thead>
              <tr>
                <th>Hall Name</th>
                <th>Slot</th>
                <th>Purpose</th>
                <th>Booked By</th>
                <th>Booked On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, index) => (
                  
                <tr key={index}>
                  <td>{booking.hall}</td>
                  <td>{booking.slots.join(", ")}</td> {/* Convert array to string */}
                  <td>{booking.purpose}</td>
                  <td>{booking.user_name}</td> {/* Correct field name */}
                  <td>{new Date(booking.date).toISOString().split("T")[0]}</td>
                  {/* Format date */}
                  
                  <td>
                    <button
                      className="delete-button"
                      disabled={booking.userId !== currentUser?.userId}
                      onClick={() => handleDelete(booking.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HallBooking;
