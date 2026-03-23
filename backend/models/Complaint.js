const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema({
    text: { type: String, required: true },
    category: { type: String, required: true },
    sentiment: { type: String, required: true },
    priority: { type: String, required: true },
    response: { type: String, required: true },
    status: { type: String, enum: ['pending', 'resolved'], default: 'pending' },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Complaint', complaintSchema);
