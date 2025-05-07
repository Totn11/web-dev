import React, { useState } from 'react';

const BookingPage = () => {
    const [resourceId, setResourceId] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [message, setMessage] = useState('');

    const handleBooking = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ resourceId, bookingDate }),
            });

            if (response.ok) {
                setMessage('Booking successful!');
            } else {
                setMessage('Booking failed. Please try again.');
            }
        } catch (error) {
            setMessage('An error occurred. Please try again.');
        }
    };

    return (
        <div>
            <h1>Book a Resource</h1>
            <form onSubmit={handleBooking}>
                <div>
                    <label htmlFor="resourceId">Resource ID:</label>
                    <input
                        type="text"
                        id="resourceId"
                        value={resourceId}
                        onChange={(e) => setResourceId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label htmlFor="bookingDate">Booking Date:</label>
                    <input
                        type="date"
                        id="bookingDate"
                        value={bookingDate}
                        onChange={(e) => setBookingDate(e.target.value)}
                        required
                    />
                </div>
                <button type="submit">Book Resource</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default BookingPage;