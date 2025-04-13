import { Schema, model } from 'mongoose';

const ConnectionSchema = new Schema({
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
    status: {
        type: String,
        enum: ['pending', 'accepted'],
        default: 'pending',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default model('Connection', ConnectionSchema);
