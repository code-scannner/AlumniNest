import Post from "../models/Post.js";

// @desc    Create a new post
// @route   POST /api/post
// @access  Private (Alumni only)
export async function createPost(req, res) {
  try {
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const post = new Post({
      alumni_id: req.alumni._id, // Get alumni ID from token
      content,
    });

    await post.save();
    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
