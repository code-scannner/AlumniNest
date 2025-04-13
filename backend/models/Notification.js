import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
    receiver_id: { type: Schema.Types.ObjectId, refPath: 'receiverModel', required: true },
    receiverModel: { type: String, enum: ['Student', 'Alumni'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ["connection-request", "post-message", "request-accepted", "request-rejected"], required: true },
    read: { type: Boolean, default: false }
});

export default model('Notification', NotificationSchema);