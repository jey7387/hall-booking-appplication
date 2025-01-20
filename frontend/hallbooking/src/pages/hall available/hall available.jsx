import React, { useState, useEffect } from "react";
import "./hall available.css";
import Sidebar from "../../components/sidebar/sidebar";
import bitLogo from "../../assets/bitlogo.png";


const HallAvailable = () => {
    const halls = ["Main Auditorium", "Vedhanayagam Auditorium", "ECE Seminar Hall", "SF Seminar Hall"];
    const slots = [
        "8:30 - 9:00", "9:00 - 9:30", "9:30 - 10:00", "10:00 - 10:30",
        "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00", "12:00 - 12:30",
        "1:00 - 1:30", "1:30 - 2:00", "2:00 - 2:30", "2:30 - 3:00",
        "3:00 - 3:30", "3:30 - 4:00", "4:00 - 4:30", "after 4:30"
    ];

    const [selectedDate, setSelectedDate] = useState("");
    const [hallBookings, setHallBookings] = useState({});

    useEffect(() => {
        if (selectedDate) {
            // Fetch the availability for all halls on the selected date
            const fetchBookings = async () => {
                try {
                    const results = await Promise.all(
                        halls.map(hall =>
                            fetch(`http://localhost:5000/api/hall-availability?hall=${hall}&date=${selectedDate}`)
                                .then(response => response.json())
                        )
                    );
                    const bookingData = halls.reduce((acc, hall, index) => {
                        acc[hall] = results[index];
                        return acc;
                    }, {});
                    setHallBookings(bookingData);
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchBookings();
        }
    }, [selectedDate, halls]);

    return (
        <div className="hall-available-container">
            
            <Sidebar />
            <div className="hall-available-main">
                <header className="hall-available-header">
                    <img src={bitLogo} alt="BIT Logo" className="hall-available-logo" />
                    <h1>BIT</h1>
                    
                </header>
                <h1 className="hall-available-title">Hall Availability</h1>
                <div className="hall-available-filters">
                    <label>Select Date:</label>
                    <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
                </div>
                <table className="hall-available-table">
                    <thead>
                        <tr>
                            <th>Hall</th>
                            {slots.map((slot, index) => (
                                <th key={index}>{slot}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {halls.map((hall, index) => {
                            const bookedSlots = hallBookings[hall]?.bookedSlots || [];
                            const availableSlots = hallBookings[hall]?.availableSlots || [];

                            return (
                                <tr key={index}>
                                    <td>{hall}</td>
                                    {slots.map((slot, idx) => {
                                        const isBooked = bookedSlots.includes(slot);
                                        const isAvailable = availableSlots.includes(slot);
                                        return (
                                            <td key={idx} className={isBooked ? "slot-unavailable" : "slot-available"}>
                                                {isBooked ? "Booked" : isAvailable ? "Available" : "Unknown"}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default HallAvailable;
