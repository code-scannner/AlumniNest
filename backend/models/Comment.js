const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  post_id: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true }, // The post being commented on
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Student or Alumni who commented
  content: { type: String, required: true }, // The comment text
  timestamp: { type: Date, default: Date.now }, // When the comment was created
  parent_id: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null }, // If null, it's a main comment; otherwise, it's a reply
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }] // Array of replies (nested comments)
});

module.exports = mongoose.model("Comment", CommentSchema);