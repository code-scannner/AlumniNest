import { Schema, model } from 'mongoose';

const LikeSchema = new Schema({
    post_id: { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    timestamp: { type: Date, default: Date.now }
});

export default model('Like', LikeSchema);