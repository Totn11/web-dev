import React, { useState, useEffect } from 'react';
import axios from 'axios';

function AdminPanel() {
    const [resources, setResources] = useState([]);
    const [bookings, setBookings] = useState([]);
    const [users, setUsers] = useState([]);
    const [newResource, setNewResource] = useState({ name: '', description: '', category: '', availableSlots: [] });

    useEffect(() => {
        // Fetch resources, bookings, and users from the backend API
        axios.get('/api/resources').then(response => setResources(response.data));
        axios.get('/api/bookings').then(response => setBookings(response.data));
        axios.get('/api/users').then(response => setUsers(response.data));
    }, []);

    const handleAddResource = () => {
        axios.post('/api/resources', newResource)
            .then(response => {
                setResources([...resources, response.data]);
                setNewResource({ name: '', description: '', category: '', availableSlots: [] });
            })
            .catch(error => console.error('Error adding resource:', error));
    };

    const handleUpdateResource = (id, updatedResource) => {
        axios.put(`/api/resources/${id}`, updatedResource)
            .then(response => {
                setResources(resources.map(resource => resource.id === id ? response.data : resource));
            })
            .catch(error => console.error('Error updating resource:', error));
    };

    const handleDeleteResource = (id) => {
        axios.delete(`/api/resources/${id}`)
            .then(() => {
                setResources(resources.filter(resource => resource.id !== id));
            })
            .catch(error => console.error('Error deleting resource:', error));
    };

    return (
        <div>
            <h1>Admin Panel</h1>

            <section>
                <h2>Manage Resources</h2>
                <div>
                    <h3>Add New Resource</h3>
                    <input
                        type="text"
                        placeholder="Name"
                        value={newResource.name}
                        onChange={(e) => setNewResource({ ...newResource, name: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        value={newResource.description}
                        onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Category"
                        value={newResource.category}
                        onChange={(e) => setNewResource({ ...newResource, category: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="Available Slots (comma-separated)"
                        value={newResource.availableSlots.join(', ')}
                        onChange={(e) => setNewResource({ ...newResource, availableSlots: e.target.value.split(',').map(slot => slot.trim()) })}
                    />
                    <button onClick={handleAddResource}>Add Resource</button>
                </div>

                <div>
                    <h3>Existing Resources</h3>
                    {resources.map(resource => (
                        <div key={resource.id}>
                            <p>{resource.name} - {resource.description} - {resource.category}</p>
                            <button onClick={() => handleUpdateResource(resource.id, { ...resource, name: 'Updated Name' })}>Update</button>
                            <button onClick={() => handleDeleteResource(resource.id)}>Delete</button>
                        </div>
                    ))}
                </div>
            </section>

            <section>
                <h2>View Bookings</h2>
                {bookings.map(booking => (
                    <div key={booking.id}>
                        <p>Resource: {booking.resourceName}, Slot: {booking.slot}, User: {booking.userName}</p>
                    </div>
                ))}
            </section>

            <section>
                <h2>Manage Users</h2>
                {users.map(user => (
                    <div key={user.id}>
                        <p>{user.name} - {user.email}</p>
                        <button>Delete User</button>
                    </div>
                ))}
            </section>
        </div>
    );
}

export default AdminPanel;