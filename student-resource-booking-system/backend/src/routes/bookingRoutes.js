import express from 'express';
import verifyAccess from '../middleware/authMiddleware.js';
import validateInput from '../middleware/validationMiddleware.js';
import bookingManager from '../controllers/bookingController.js';

const router = express.Router();

const initializeBookingRoutes = () => {
    // Create new booking
    router.post(
        '/new',
        verifyAccess.validateSession,
        validateInput.bookingRequest,
        bookingManager.processNewBooking
    );

    // Get user's bookings
    router.get(
        '/history',
        verifyAccess.validateSession,
        bookingManager.fetchUserBookings
    );

    // Update existing booking
    router.put(
        '/modify/:bookingId',
        verifyAccess.validateSession,
        validateInput.bookingRequest,
        bookingManager.modifyBooking
    );

    // Cancel booking
    router.delete(
        '/cancel/:bookingId',
        verifyAccess.validateSession,
        bookingManager.cancelBooking
    );

    // Admin route: View all bookings
    router.get(
        '/all',
        verifyAccess.validateSession,
        verifyAccess.checkAdminRights,
        async (req, res) => {
            try {
                const allBookings = await bookingManager.getAllBookings();
                res.status(200).json({
                    success: true,
                    data: allBookings
                });
            } catch (err) {
                res.status(500).json({
                    success: false,
                    message: 'Failed to retrieve bookings',
                    error: err.message
                });
            }
        }
    );
};

initializeBookingRoutes();

export default router;