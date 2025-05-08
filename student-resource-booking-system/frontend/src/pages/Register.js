import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
import api from '../context/api';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [formFields, setFormFields] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'student'
    });
    const [pageState, setPageState] = useState({
        processing: false,
        errors: {},
        passwordStrength: '',
        showPassword: false
    });

    const checkPasswordStrength = (password) => {
        let strength = 0;
        const feedback = [];

        if (password.length >= 8) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[a-z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^A-Za-z0-9]/.test(password)) strength += 1;

        switch (strength) {
            case 0:
            case 1:
                return 'weak';
            case 2:
            case 3:
                return 'moderate';
            case 4:
            case 5:
                return 'strong';
            default:
                return '';
        }
    };

    const handleFieldChange = (e) => {
        const { name, value } = e.target;
        setFormFields(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear specific field error
        if (pageState.errors[name]) {
            setPageState(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    [name]: ''
                }
            }));
        }

        // Update password strength indicator
        if (name === 'password') {
            setPageState(prev => ({
                ...prev,
                passwordStrength: checkPasswordStrength(value)
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        const { name, email, password, confirmPassword } = formFields;

        if (!name || name.length < 2) {
            newErrors.name = 'Name should be at least 2 characters long';
        }

        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!password || password.length < 8) {
            newErrors.password = 'Password should be at least 8 characters long';
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setPageState(prev => ({
            ...prev,
            errors: newErrors
        }));

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) console.log("Error filling form");

        setPageState(prev => ({
            ...prev,
            processing: true
        }));

        try {
            const response = await api.post('/api/auth/register', {
                name: formFields.name,
                email: formFields.email,
                password: formFields.password,
                role: formFields.role
            });

            if (response.data.message) {
                navigate('/', { 
                    state: { message: 'Registration successful! Please login.' }
                });
            }
        } catch (err) {
            console.log(err)
            const errorMsg = err.response?.data?.errors[0].msg || err.response?.data?.errors?.message || 'Registration failed';
            setPageState(prev => ({
                ...prev,
                errors: {
                    ...prev.errors,
                    submit: errorMsg
                }
            }));
        } finally {
            setPageState(prev => ({
                ...prev,
                processing: false
            }));
        }
    };

    const togglePasswordVisibility = () => {
        setPageState(prev => ({
            ...prev,
            showPassword: !prev.showPassword
        }));
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-bold text-gray-900">
                        Create Your Account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        {/* Name Field */}
                        <div className="mb-4">
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Full Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formFields.name}
                                onChange={handleFieldChange}
                            />
                            {pageState.errors.name && (
                                <p className="mt-1 text-sm text-red-600">
                                    {pageState.errors.name}
                                </p>
                            )}
                        </div>

                        {/* Email Field */}
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Email Address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formFields.email}
                                onChange={handleFieldChange}
                            />
                            {pageState.errors.email && (
                                <p className="mt-1 text-sm text-red-600">
                                    {pageState.errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Fields */}
                        <div className="mb-4">
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type={pageState.showPassword ? "text" : "password"}
                                    required
                                    className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    value={formFields.password}
                                    onChange={handleFieldChange}
                                />
                                <button
                                    type="button"
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    onClick={togglePasswordVisibility}
                                >
                                    <span className="text-sm text-gray-600">
                                        {pageState.showPassword ? 'Hide' : 'Show'}
                                    </span>
                                </button>
                            </div>
                            {pageState.passwordStrength && (
                                <div className={`mt-1 text-sm ${
                                    pageState.passwordStrength === 'weak' ? 'text-red-600' :
                                    pageState.passwordStrength === 'moderate' ? 'text-yellow-600' :
                                    'text-green-600'
                                }`}>
                                    Password strength: {pageState.passwordStrength}
                                </div>
                            )}
                        </div>

                        <div className="mb-4">
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                value={formFields.confirmPassword}
                                onChange={handleFieldChange}
                            />
                            {pageState.errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">
                                    {pageState.errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Role Selection */}
                        <div className="mb-4">
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <select
                                id="role"
                                name="role"
                                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                                value={formFields.role}
                                onChange={handleFieldChange}
                            >
                                <option value="student">Student</option>
                                <option value="admin">Administrator</option>
                            </select>
                        </div>
                    </div>

                    {pageState.errors.submit && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="ml-3">
                                    <h3 className="text-sm font-medium text-red-800">
                                        {pageState.errors.submit}
                                    </h3>
                                </div>
                            </div>
                        </div>
                    )}

                    <div>
                        <button
                            type="submit"
                            disabled={pageState.processing}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                pageState.processing
                                    ? 'bg-indigo-400 cursor-not-allowed'
                                    : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                            }`}
                        >
                            {pageState.processing ? 'Creating account...' : 'Create Account'}
                        </button>
                    </div>

                    <div className="text-sm text-center">
                        <a href="/" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Already have an account? Sign in
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterPage;