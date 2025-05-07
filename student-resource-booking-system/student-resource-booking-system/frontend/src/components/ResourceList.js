import React, { useEffect, useState } from 'react';

const ResourceList = () => {
    const [resources, setResources] = useState([]);

    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await fetch('/api/resources');
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error('Error fetching resources:', error);
            }
        };

        fetchResources();
    }, []);

    return (
        <div>
            <h2>Available Resources</h2>
            <ul>
                {resources.map(resource => (
                    <li key={resource._id}>
                        {resource.name} - {resource.description}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ResourceList;