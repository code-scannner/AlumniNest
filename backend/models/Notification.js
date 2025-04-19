import { Schema, model } from 'mongoose';

const NotificationSchema = new Schema({
    sender_id: { type: Schema.Types.ObjectId, refPath: 'senderModel', required: true },
    senderModel: { type: String, enum: ['Student', 'Alumni'], required: true },
    receiver_id: { type: Schema.Types.ObjectId, refPath: 'receiverModel', required: true },
    receiverModel: { type: String, enum: ['Student', 'Alumni'], required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    redirect_id: { type: String },
    type: {
        type: String,
        enum: [
            "connection_request",
            "connection_accepted",
            "post_created",
            "post_liked",
            "post_commented"
        ],
        required: true
    },
    read: { type: Boolean, default: false }
});

export default model('Notification', NotificationSchema);