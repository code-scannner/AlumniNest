const mongoose = require('mongoose');

const ConnectionSchema = new mongoose.Schema({
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    alumni_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
    status: { type: String, enum: ["accepted", "pending", "rejected"], required: true }
});

module.exports = mongoose.model('Connection', ConnectionSchema);