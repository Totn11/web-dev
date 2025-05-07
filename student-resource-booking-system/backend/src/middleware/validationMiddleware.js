import { body } from 'express-validator';

// Validation for user registration
export const validateRegister = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Invalid email address'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number'),
    body('role').isIn(['student', 'admin']).withMessage('Invalid role'),
];

// Validation for user login
export const validateLogin = [
    body('email').isEmail().withMessage('Invalid email address'),
    body('password').notEmpty().withMessage('Password is required'),
];

// Validation for resource creation
export const validateResource = [
    body('name').notEmpty().withMessage('Name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('availableSlots')
        .isArray({ min: 1 })
        .withMessage('Available slots must be an array with at least one slot'),
];

// Validation for booking creation
export const validateBooking = [
    body('resourceId').notEmpty().withMessage('Resource ID is required'),
    body('slot').notEmpty().withMessage('Slot is required'),
];