import { Schema, model } from 'mongoose';

const ChatSchema = new Schema({
    sender_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    receiver_id: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

export default model('Chat', ChatSchema);