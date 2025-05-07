import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const ResourceList = () => {
    const [items, setItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const { authState } = useAuth();

    const loadResourceData = async () => {
        if (!authState.isLoggedIn) {
            setErrorMsg('Please sign in to view resources');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.get('/api/resources/list', {
                headers: {
                    'Authorization': `Bearer ${authState.token}`,
                    'Cache-Control': 'no-cache'
                }
            });

            if (response.data?.length > 0) {
                const sortedItems = response.data.sort((a, b) => 
                    a.name.localeCompare(b.name)
                );
                setItems(sortedItems);
            } else {
                setItems([]);
            }
        } catch (err) {
            console.error('Failed to fetch resources:', err?.message);
            setErrorMsg('Unable to load resources. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        if (mounted) {
            loadResourceData();
        }

        return () => {
            mounted = false;
        };
    }, [authState]);

    if (isLoading) {
        return <div className="text-center p-4">Loading resources...</div>;
    }

    if (errorMsg) {
        return <div className="text-red-500 p-4">{errorMsg}</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-semibold mb-6">Available Resources</h2>
            {items.length === 0 ? (
                <p className="text-gray-600">No resources available at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {items.map(item => (
                        <div 
                            key={item._id}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                        >
                            <h3 className="text-xl font-medium">{item.name}</h3>
                            <p className="text-gray-600 mt-2">{item.description}</p>
                            <div className="mt-3 flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    Category: {item.category}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-sm ${
                                    item.status === 'Available' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {item.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ResourceList;