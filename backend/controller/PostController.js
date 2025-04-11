import Connection from "../models/Connection.js";
import Post from "../models/Post.js";


// @desc    Get all posts from a student's connected alumni
// @route   GET /api/post/
export async function getPosts(req, res) {
  try {
    const { id } = req.user;

    const posts = await Post.find({
      poster_id: id
    })
      .sort({ timestamp: -1 }) // latest first
      .exec();

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

// @desc    Create a new post
// @route   POST /api/post
// @access  Private (Alumni only)
export async function createPost(req, res) {
  try {
    const content = req.body.body;
    const path = req.file?.path;

    console.log(req.file)

    if (!content) return res.status(400).json({ message: "Content is required" });

    const post = new Post({
      poster_id: req.user.id,
      poster_model: req.user.role,
      image: path ? path : null,
      content,
    });

    await post.save();

    // Find all students connected to the alumni
    const connections = await Connection.find({ alumni_id: req.user._id, status: "accepted" })
      .select("student_id")
      .exec();

    if (connections.length > 0) {
      // Create notifications for all connected students
      const notifications = connections.map(conn => ({
        receiver_id: conn.student_id,
        receiverModel: "Student",
        content: "A new post has been shared by your connection.",
        type: "post-message"
      }));

      // Insert all notifications at once
      await Notification.insertMany(notifications);
    }

    res.status(201).json({ message: "Post created successfully", post , success : true});
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
}
