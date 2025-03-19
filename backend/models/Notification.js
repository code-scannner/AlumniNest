const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
    receiver_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel', required: true },
    receiverModel: { type: String, enum: ['Student', 'Alumni'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ["connection-request", "post-message", "request-accepted"], required: true },
    read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Notification', NotificationSchema);