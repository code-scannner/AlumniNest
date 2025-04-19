import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
    {
        sender_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "senderModel",
            required: true
        }, // Sender of the message
        senderModel: { type: String, required: true, enum: ['Alumni', 'Student'] },
        content: {
            type: String,
            required: true
        }, // Message text

        status: {
            type: String,
            enum: ["sent", "delivered", "read"],
            default: "sent"
        }, // Message status

        timestamp: {
            type: Date,
            default: Date.now
        } // Time of message
    }
);

export default model("Chat", MessageSchema);