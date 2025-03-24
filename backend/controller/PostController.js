import Connection from "../models/Connection.js";
import Post from "../models/Post.js";


// @desc    Get all posts from a student's connected alumni
// @route   GET /api/post/
// @access  Private (Only student can access their connections' posts)
export async function getConnectedAlumniPosts(req, res) {
  try {
    const student_id = req.user._id;

    // Find all accepted connections for the student
    const connections = await Connection.find({ student_id, status: "accepted" }).select("alumni_id");

    if (!connections.length) {
      return res.status(200).json({ message: "No connections found", posts: [] });
    }

    // Extract alumni IDs from connections
    const alumniIds = connections.map(conn => conn.alumni_id);

    // Find all posts from connected alumni, sorted by timestamp (latest first)
    const posts = await Post.find({ alumni_id: { $in: alumniIds } })
      .populate("alumni_id", "username full_name profile_pic curr_work position") // Get alumni details
      .sort({ timestamp: -1 }) // Latest first
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
    const { content } = req.body;

    if (!content) return res.status(400).json({ message: "Content is required" });

    const post = new Post({
      alumni_id: req.user._id, // Get alumni ID from token
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

    res.status(201).json({ message: "Post created successfully", post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
