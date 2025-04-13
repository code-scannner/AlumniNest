import Like from '../models/Like.js'; // adjust the import path if needed
import Comment from '../models/Comment.js'; // adjust the import path if needed

export async function isLiked(req, res) {
    try {
        console.log("is Liked Api Called");
        const { user_id, post_id } = req.query;

        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        const like = await Like.findOne({ post_id, user_id });
        const total_likes = await Like.countDocuments({ post_id });
        const total_comments = await Comment.countDocuments({ post_id });

        res.status(200).json({ success : true,isLiked: !!like, total_likes, total_comments  }); // true if like exists, false otherwise
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function likePost(req, res) {
    try {
        console.log("like Post Api Called");
        const { post_id } = req.body;
        const { id: user_id } = req.user;

        // Check if already liked
        const existingLike = await Like.findOne({ post_id, user_id });
        if (existingLike) {
            return res.status(400).json({ success: true, message: 'Post already liked.' });
        }

        const like = new Like({ post_id, user_id });
        await like.save();

        res.status(200).json({ success: true, message: 'Post liked successfully.' });
    } catch (error) {
        console.error("Error liking post:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function unlikePost(req, res) {
    try {
        console.log("unlike Post Api Called");
        const { post_id } = req.body;
        const { id: user_id } = req.user;

        if(!post_id){
            console.log("No post_id");
        }

        if(!user_id){
            console.log("No user_id");
        }

        const deleted = await Like.findOneAndDelete({ post_id, user_id });

        if (!deleted) {
            return res.status(404).json({ success: true, message: 'Like not found.' });
        }

        res.status(200).json({ success: true, message: 'Post unliked successfully.' });
    } catch (error) {
        console.error("Error unliking post:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}
