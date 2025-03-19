const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema({
    sender_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    receiver_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Chat', ChatSchema);