import { Schema, model } from "mongoose";

const CommentSchema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true }, // The post being commented on
  user_id: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Student or Alumni who commented
  content: { type: String, required: true }, // The comment text
  timestamp: { type: Date, default: Date.now }, // When the comment was created
  parent_id: { type: Schema.Types.ObjectId, ref: "Comment", default: null }, // If null, it's a main comment; otherwise, it's a reply
  replies: [{ type: Schema.Types.ObjectId, ref: "Comment" }] // Array of replies (nested comments)
});

export default model("Comment", CommentSchema);