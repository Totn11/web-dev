import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../context/api';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const { authenticateUser } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [uiState, setUiState] = useState({
        isProcessing: false,
        errorMsg: '',
        showPassword: false
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (uiState.errorMsg) {
            setUiState(prev => ({ ...prev, errorMsg: '' }));
        }
    };

    const validateForm = () => {
        const { email, password } = formData;
        if (!email || !password) {
            setUiState(prev => ({
                ...prev,
                errorMsg: 'Please fill in all fields'
            }));
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setUiState(prev => ({ ...prev, isProcessing: true }));

        try {
            const response = await api.post('/api/auth/login', formData);
            const { token, user } = response.data;

            authenticateUser(user, token);

            // Redirect based on user role
            if (user.role === 'admin') {
                navigate('/admin-dashboard');
            } else {
                navigate('/dashboard');
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Authentication failed';
            setUiState(prev => ({
                ...prev,
                errorMsg: errorMessage,
                isProcessing: false
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setUiState(prev => ({
            ...prev,
            showPassword: !prev.showPassword
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Welcome Back
                    </h2>
                </div>
                
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="relative">
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type={uiState.showPassword ? "text" : "password"}
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleInputChange}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                onClick={togglePasswordVisibility}
                            >
                                <span className="text-sm text-gray-600">
                                    {uiState.showPassword ? 'Hide' : 'Show'}
                                </span>
                            </button>
                        </div>
                    </div>

                    {uiState.errorMsg && (
                        <div className="text-red-600 text-sm text-center">
                            {uiState.errorMsg}
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={uiState.isProcessing}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                uiState.isProcessing
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {uiState.isProcessing ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <a href="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Don't have an account? Register
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;