import { Schema, model } from 'mongoose';

const ConnectionSchema = new Schema({
    student_id: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    alumni_id: { type: Schema.Types.ObjectId, ref: 'Alumni', required: true },
    status: { type: String, enum: ["accepted", "pending", "rejected"], required: true }
});

export default model('Connection', ConnectionSchema);