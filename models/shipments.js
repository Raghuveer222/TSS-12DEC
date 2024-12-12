const mongoose = require('mongoose');

const shipmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: true
    },
    transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transporter', // Reference to the Transporter model
        default: null // Assigned when a transporter accepts the shipment
    },
    location: {
        type: String,
        required: true
    },
    dateTime: {
        type: Date,
        required: true
    },
    goodsDescription: {
        type: String,
        required: true
    },
    vehicleType: {
        type: String,
        enum: ['Truck', 'Van', 'Bike'],
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'In Transit', 'Completed', 'Cancelled'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Shipment', shipmentSchema);
