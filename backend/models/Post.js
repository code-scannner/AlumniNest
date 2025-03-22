const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    alumni_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Alumni', required: true },
    content: { type: String, required: true },
    image: { type: String },
    timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);