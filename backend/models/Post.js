import { Schema, model } from 'mongoose';

const PostSchema = new Schema({
    poster_id: { type: Schema.Types.ObjectId, required: true, refPath: 'poster_model' },
    poster_model: { type: String, required: true, enum: ['Alumni', 'Student'] }, // dynamic model name
    content: { type: String, required: true },
    image: { type: String },
    timestamp: { type: Date, default: Date.now }
});

export default model('Post', PostSchema);