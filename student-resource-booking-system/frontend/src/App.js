import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AdminPanel from './pages/AdminPanel';
import MyBookings from './pages/MyBookings';
import ResourceList from './components/ResourceList';
import BookingPage from './pages/BookingPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/admin" element={<AdminPanel />} />
                <Route path="/my-bookings" element={<MyBookings />} />
                <Route path="/resources" element={<ResourceList />} />
                <Route path="/booking" element={<BookingPage />} />
            </Routes>
        </Router>
    );
}

export default App;