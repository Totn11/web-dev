import mongoose from 'mongoose';

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Resource',
        required: true,
    },
    slot: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['Active', 'Cancelled'],
        default: 'Active',
    },
}, { timestamps: true });

const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;