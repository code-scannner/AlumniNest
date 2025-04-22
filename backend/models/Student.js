import { Schema, model } from 'mongoose';

const StudentSchema = new Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    profile_pic: { type: String },
    passout_year: { type: Number, required: true },
    phone_no: { type: Number, required: true },
    course: { type: String, enum: ["B.Tech", "M.Tech", "PhD"], required: true },
    branch: { type: String, enum: ["CSE", "EE", "ECE", "AIDS", "VLSI", "CIVIL", "MECHANICAL", "AEROSPACE"], required: true },
    college: { type: String, required: true },
    bio: { type: String },
    emailVerified: { type: Boolean, default: false },
    emailOtp: { type: Number },
    forgetOtp: { type: Number },
});

export default model('Student', StudentSchema);