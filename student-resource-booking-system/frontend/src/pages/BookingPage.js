import React, { useState, useEffect } from 'react';
// import axios from 'axios';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';

const BookingPage = () => {
    const { authState } = useAuth();
    const [resourceList, setResourceList] = useState([]);
    const [selectedResource, setSelectedResource] = useState(null);
    const [chosenSlot, setChosenSlot] = useState('');
    const [feedback, setFeedback] = useState({ type: '', message: '' });
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        let isComponentMounted = true;

        const fetchAvailableResources = async () => {
            try {
                const response = await api.get('/api/resources/list', {
                    headers: {
                        'Authorization': `Bearer ${authState.token}`,
                        'Cache-Control': 'no-cache'
                    }
                });

                if (isComponentMounted && response.data) {
                    const sortedResources = response.data.sort((a, b) => 
                        a.name.localeCompare(b.name)
                    );
                    setResourceList(sortedResources);
                }
            } catch (err) {
                if (isComponentMounted) {
                    setFeedback({
                        type: 'error',
                        message: 'Failed to load available resources'
                    });
                }
            }
        };

        if (authState.isLoggedIn) {
            fetchAvailableResources();
        }

        return () => {
            isComponentMounted = false;
        };
    }, [authState]);

    const handleResourceSelection = (event) => {
        const selected = resourceList.find(r => r._id === event.target.value);
        setSelectedResource(selected);
        setChosenSlot('');
        setFeedback({ type: '', message: '' });
    };

    const handleSlotSelection = (event) => {
        setChosenSlot(event.target.value);
        setFeedback({ type: '', message: '' });
    };

    const processBooking = async (event) => {
        event.preventDefault();
        
        if (!selectedResource || !chosenSlot) {
            setFeedback({
                type: 'error',
                message: 'Please select both a resource and a time slot'
            });
            return;
        }

        setIsProcessing(true);

        try {
            const response = await api.post('/api/bookings/new', {
                resourceId: selectedResource._id,
                timeSlot: chosenSlot
            }, {
                headers: {
                    'Authorization': `Bearer ${authState.token}`
                }
            });

            if (response.data.success) {
                setFeedback({
                    type: 'success',
                    message: 'Your booking has been confirmed!'
                });
                setSelectedResource(null);
                setChosenSlot('');
                
                // Refresh resource list to update availability
                const updatedResources = await api.get('/api/resources/list', {
                    headers: {
                        'Authorization': `Bearer ${authState.token}`
                    }
                });
                setResourceList(updatedResources.data);
            }
        } catch (err) {
            setFeedback({
                type: 'error',
                message: err.response?.data?.message || 'Failed to process booking'
            });
        } finally {
            setIsProcessing(false);
        }
    };

    if (!authState.isLoggedIn) {
        return (
            <div className="text-center p-8">
                <p className="text-red-500">Please sign in to make a booking</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-8">Book a Resource</h1>

            <form onSubmit={processBooking} className="space-y-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-2">
                            Select Resource
                        </label>
                        <select
                            className="w-full p-2 border rounded-md"
                            value={selectedResource?._id || ''}
                            onChange={handleResourceSelection}
                            required
                        >
                            <option value="">-- Choose a resource --</option>
                            {resourceList.map(resource => (
                                <option key={resource._id} value={resource._id}>
                                    {resource.name} - {resource.category}
                                </option>
                            ))}
                        </select>
                    </div>

                    {selectedResource && (
                        <div>
                            <label className="block text-gray-700 mb-2">
                                Select Time Slot
                            </label>
                            <select
                                className="w-full p-2 border rounded-md"
                                value={chosenSlot}
                                onChange={handleSlotSelection}
                                required
                            >
                                <option value="">-- Choose a time slot --</option>
                                {selectedResource.availableSlots.map(slot => (
                                    <option key={slot} value={slot}>
                                        {slot}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {feedback.message && (
                    <div className={`p-4 rounded-md ${
                        feedback.type === 'error' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-green-100 text-green-700'
                    }`}>
                        {feedback.message}
                    </div>
                )}

                <button
                    type="submit"
                    className={`w-full py-2 px-4 rounded-md text-white
                        ${isProcessing 
                            ? 'bg-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    disabled={isProcessing}
                >
                    {isProcessing ? 'Processing...' : 'Confirm Booking'}
                </button>
            </form>
        </div>
    );
};

export default BookingPage;