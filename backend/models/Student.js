const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    full_name: { type: String, required: true },
    profile_pic: { type: String },
    resume: { type: String },
    passout_year: { type: Number, required: true },
    phone_no: { type: Number, required: true },
    course: { type: String, enum: ["Btech", "Mtech"], required: true },
    branch: { type: String, enum: ["CSE", "EE", "ECE", "AIDS", "VLSI", "CIVIL", "MECHANICAL", "AEROSPACE"], required: true },
    college: { type: String, required: true },
    bio: { type: String }
});

module.exports = mongoose.model('Student', StudentSchema);