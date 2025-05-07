// This file defines the Resource model using Mongoose, specifying the schema for resources in the MongoDB database.

const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        default: true,
    },
    bookingDetails: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        bookingDate: {
            type: Date,
            required: true,
        },
        duration: {
            type: Number,
            required: true,
        },
    }],
}, { timestamps: true });

const Resource = mongoose.model('Resource', resourceSchema);

module.exports = Resource;