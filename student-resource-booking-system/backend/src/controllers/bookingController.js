import { Types } from 'mongoose';
import Booking from '../models/bookingModel';
import Resource from '../models/resourceModel';

class BookingController {
    async createBooking(req, res) {
        const { resourceId, timeSlot } = req.body;
        const userId = req.currentUser._id;

        try {
            const resource = await Resource.findOne({
                _id: resourceId,
                'availableSlots': { $elemMatch: { $eq: timeSlot } }
            }).select('name availableSlots status');

            if (!resource) {
                return res.status(404).json({
                    success: false,
                    message: 'Resource not found or time slot not available'
                });
            }

            const booking = new Booking({
                userId,
                resourceId,
                timeSlot,
                status: 'confirmed'
            });

            const [savedBooking] = await Promise.all([
                booking.save(),
                Resource.updateOne(
                    { _id: resourceId },
                    { $pull: { availableSlots: timeSlot } }
                )
            ]);

            res.status(201).json({
                success: true,
                data: savedBooking,
                message: 'Booking created successfully'
            });
        } catch (error) {
            console.error('Error creating booking:', error);
            res.status(500).json({
                success: false,
                message: 'Error creating booking',
                error: error.message
            });
        }
    }

    async getUserBookings(req, res) {
        const userId = req.currentUser._id;

        try {
            const [bookings, totalCount] = await Promise.all([
                Booking.find({ userId })
                    .populate('resourceId', 'name description category')
                    .sort('-createdAt')
                    .lean()
                    .exec(),
                Booking.countDocuments({ userId })
            ]);

            res.status(200).json({
                success: true,
                data: bookings,
                metadata: {
                    totalCount
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error retrieving bookings',
                error: error.message
            });
        }
    }

    async updateBooking(req, res) {
        const { bookingId } = req.params;
        const { newTimeSlot } = req.body;
        const userId = req.currentUser._id;

        try {
            const bookingToUpdate = await Booking.findOne({
                _id: bookingId,
                userId
            }).populate('resourceId');

            if (!bookingToUpdate) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            const [updatedBooking] = await Promise.all([
                Booking.findByIdAndUpdate(
                    bookingId,
                    { 
                        $set: { 
                            timeSlot: newTimeSlot,
                            updatedAt: new Date()
                        }
                    },
                    { new: true }
                ),
                Resource.updateOne(
                    { _id: bookingToUpdate.resourceId },
                    { 
                        $pull: { availableSlots: newTimeSlot },
                        $push: { availableSlots: bookingToUpdate.timeSlot }
                    }
                )
            ]);

            res.status(200).json({
                success: true,
                data: updatedBooking,
                message: 'Booking updated successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error updating booking',
                error: error.message
            });
        }
    }

    async deleteBooking(req, res) {
        const { bookingId } = req.params;
        const userId = req.currentUser._id;

        try {
            const bookingToDelete = await Booking.findOne({
                _id: bookingId,
                userId
            });

            if (!bookingToDelete) {
                return res.status(404).json({
                    success: false,
                    message: 'Booking not found'
                });
            }

            await Promise.all([
                Resource.updateOne(
                    { _id: bookingToDelete.resourceId },
                    { $push: { availableSlots: bookingToDelete.timeSlot } }
                ),
                bookingToDelete.remove()
            ]);

            res.status(200).json({
                success: true,
                message: 'Booking deleted successfully'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error deleting booking',
                error: error.message
            });
        }
    }
}

export default new BookingController();