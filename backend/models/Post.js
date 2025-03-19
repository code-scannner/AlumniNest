const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    alumni_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }]
});

module.exports = mongoose.model('Post', PostSchema);