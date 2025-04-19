import { Schema, model } from 'mongoose';

const ChatSchema = new Schema(
    {
        from_user: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'from_model'
        },
        from_model: {
            type: String,
            required: true,
            enum: ['Student', 'Alumni']
        },
        to_user: {
            type: Schema.Types.ObjectId,
            required: true,
            refPath: 'to_model'
        },
        to_model: {
            type: String,
            required: true,
            enum: ['Student', 'Alumni']
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }
);

export default model("Chat", ChatSchema);