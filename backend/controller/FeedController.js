import Post from "../models/Post.js";
import Connection from "../models/Connection.js";
import Like from "../models/Like.js"
import Comment from "../models/Comment.js"
// @route   GET /api/feed
// @desc    Get the feed of the user (posts from connected users) with pagination
// @access  Private
export async function getfeed(req, res) {
    try {
        const userId = req.user.id;

        const limit = parseInt(req.query.limit) || 10;
        const skip = parseInt(req.query.skip) || 0;

        // Get accepted connections
        const connections = await Connection.find({
            $or: [
                { from_user: userId },
                { to_user: userId }
            ],
            status: "accepted"
        });

        // Extract connected user IDs
        const connectedUserIds = connections.map(conn => {
            return conn.from_user.toString() === userId
                ? conn.to_user.toString()
                : conn.from_user.toString();
        });

        // Fetch one extra post to check if more exist
        const posts = await Post.find({ poster_id: { $in: connectedUserIds } })
            .populate('poster_id', 'full_name profile_pic')
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit + 1)
            .exec();

        const hasMore = posts.length > limit;
        if (hasMore) posts.pop(); // remove the extra post

        // Add total_likes and total_comments to each post
        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                const total_likes = await Like.countDocuments({ post_id: post._id });
                const total_comments = await Comment.countDocuments({ post_id: post._id });
                return {
                    ...post.toObject(),
                    total_likes,
                    total_comments
                };
            })
        );

        res.status(200).json({
            posts: enrichedPosts,
            hasMore
        });
    } catch (error) {
        console.log("Error in getfeed:", error);
        res.status(500).json({ message: error.message });
    }
}