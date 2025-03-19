const mongoose = require('mongoose');

const LikeSchema = new mongoose.Schema({
    post_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    user_id: { type: mongoose.Schema.Types.ObjectId, refPath: 'userModel', required: true },
    userModel: { type: String, enum: ['Student', 'Alumni'], required: true },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Like', LikeSchema);