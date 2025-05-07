import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    availableSlots: {
        type: [String],
        required: true,
    },
    status: {
        type: String,
        enum: ['Available', 'Booked'],
        default: 'Available',
    },
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);
export default Resource;