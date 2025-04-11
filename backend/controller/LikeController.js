import Like from '../models/Like.js'; // adjust the import path if needed

export async function isLiked(req, res) {
    try {
        const { user_id, post_id } = req.query;

        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        const like = await Like.findOne({ post_id, user_id });

        res.status(200).json({ success: !!like }); // true if like exists, false otherwise
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function likePost(req, res) {
    try {
        console.log(req.body);
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
        const { post_id } = req.body;
        const { id: user_id } = req.user;

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
