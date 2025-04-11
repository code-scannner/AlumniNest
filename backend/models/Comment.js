import { Schema, model } from 'mongoose';
const CommentSchema = new Schema({
  post_id: { type: Schema.Types.ObjectId, ref: "Post", required: true },

  user_id: { type: Schema.Types.ObjectId, refPath: 'user_type', required: true },
  user_type: {
    type: String,
    required: true,
    enum: ["Student", "Alumni"]
  },

  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

export default model("Comment", CommentSchema);