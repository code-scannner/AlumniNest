import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    alumni_id: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    content: { type: String, required: true },
    image: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default model('Post', PostSchema);