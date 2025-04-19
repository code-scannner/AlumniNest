import { Schema, model } from 'mongoose';

const MessageSchema = new Schema(
    {
        chat_id: {
            type: Schema.Types.ObjectId,
            ref: "Chat",
            required: true
        },
        sender_id: {
            type: Schema.Types.ObjectId,
            refPath: "senderModel",
            required: true
        }, 
        senderModel: {
            type: String,
            enum: ['Alumni', 'Student'],
            required: true
        },
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

export default model("Message", MessageSchema);