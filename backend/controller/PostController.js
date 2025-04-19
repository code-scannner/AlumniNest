import Connection from "../models/Connection.js";
import Notification from "../models/Notification.js";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Like from "../models/Like.js"; // adjust the import path if needed
import { upload } from "../utils/uploadtoappwrite.js";

// @desc    Get all posts of a student given the id
// @route   GET /api/post/
export async function getPosts(req, res) {
  try {
    let id;
    if (req.user) {
      id = req.user.id;
    }
    else {
      id = req.params.id;
    }

    const limit = parseInt(req.query.limit) || 10;
    const skip = parseInt(req.query.skip) || 0;

    // Fetch one extra post to determine if more posts exist
    const posts = await Post.find({ poster_id: id })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit + 1)
      .exec();

    const hasMore = posts.length > limit;

    if (hasMore) posts.pop(); // remove the extra post

    // Add total_likes to each post
    const postsWithLikes = await Promise.all(
      posts.map(async (post) => {
        const total_likes = await Like.countDocuments({ post_id: post._id });
        const total_comments = await Comment.countDocuments({
          post_id: post._id,
        });
        return {
          ...post.toObject(),
          total_likes,
          total_comments,
        };
      })
    );

    res.status(200).json({ posts: postsWithLikes, hasMore });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
}

// @desc    Create a new post
// @route   POST /api/post
// @access  Private (Alumni only)
export async function createPost(req, res) {
  try {
    const content = req.body.body;
    const localPath = req.file?.path;

    let link = null;
    if (localPath) {
      link = await upload(localPath);
    }

    if (!content) {
      return res.status(400).json({ message: "Content is required" });
    }

    const post = new Post({
      poster_id: req.user.id,
      poster_model: req.user.role,
      image: link,
      content,
    });

    await post.save();

    const connections = await Connection.find({
      $or: [
        { from_user: req.user.id, from_model: req.user.role, status: 'accepted' },
        { to_user: req.user.id, to_model: req.user.role, status: 'accepted' }
      ]
    });

    // Extract the connected user IDs
    const connectedUserIds = connections.map(conn => ({
      id: conn.from_user.toString() === req.user.id ? conn.to_user : conn.from_user,
      model: conn.from_user.toString() === req.user.id ? conn.to_model : conn.from_model,
    }));

    // Create notifications
    const notifications = connectedUserIds.map(user => ({
      receiver_id: user.id,
      receiverModel: user.model,
      sender_id: req.user.id,
      senderModel: req.user.role,
      type: "post_created",
      content: "posted something",
      redirect_id: post._id
    }));


    // Save notifications
    await Notification.insertMany(notifications);

    res.status(201).json({
      message: "Post created successfully",
      post,
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
}

export async function getParticularPost(req, res) {
  try {
    const { post_id } = req.params;
    console.log("Fetching post details... for ", post_id);

    const post = await Post.findById(post_id).populate("poster_id", "full_name profile_pic ");

    if (!post) {
      return res.status(404).json({ message: "Post not found." });
    }

    // Get total likes
    const total_likes = await Like.countDocuments({ post_id });

    // Get all comments (optional: add .populate('user_id') to get commenter info)
    const comments = await Comment.find({ post_id })
      .populate("user_id", "username profile_pic full_name") // will work correctly if your Comment model uses refPath
      .sort({ timestamp: -1 });

    const postObj = post.toObject();
    postObj.total_likes = total_likes;
    postObj.total_comments = comments.length;

    res.status(200).json({
      post: postObj,
      comments,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function deletePost(req, res) {
  try {
    const { post_id } = req.params;
    const { id: user_id } = req.user;

    if (!post_id) {
      return res.status(400).json({ message: "Post ID is required" });
    }

    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.poster_id.toString() !== user_id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(post_id);

    res
      .status(200)
      .json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
}
