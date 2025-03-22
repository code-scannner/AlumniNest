import { Schema, model } from 'mongoose';

const AlumniSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    profile_pic: { type: String },
    batch: { type: Number, required: true },
    curr_work: { type: String },
    position: { type: String },
    bio: { type: String }
});

export default model('Alumni', AlumniSchema);