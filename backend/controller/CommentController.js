import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js"

// fetch all comments of post
// router.get("/comment", getAllComments);
export async function getAllComments(req, res) {
    try {
        const { post_id } = req.body;

        if (!post_id) {
            return res.status(400).json({ message: "Post ID is required." });
        }

        const comments = await Comment.find({ post_id })
            .populate("user_id", "full_name profile_pic")
            .sort({ timestamp: -1 });

        res.status(200).json({ comments });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// add new comment
// router.post("/comment", authMiddleware, addNewComment);
export async function addNewComment(req, res) {

    console.log("/api/post/comment API Called");
    try {
        const { post_id, content } = req.body;
        const { id: user_id, role } = req.user;

        if (!post_id || !content) {
            return res.status(400).json({ message: "Post ID and content are required." });
        }

        const post = await Post.findById(post_id);
        if (!post) {
            return res.status(400).json({ message: "Post not found." });
        }

        const newComment = new Comment({
            post_id,
            user_id,
            user_type: role,
            content
        });

        await newComment.save();

        await newComment.populate("user_id", "full_name profile_pic")

        // Avoid sending notification to the post owner if they're commenting on their own post
        if (user_id.toString() !== post.poster_id.toString()) {
            await Notification.create({
                receiver_id: post.poster_id,
                receiverModel: post.poster_model,
                sender_id: user_id,
                senderModel: role,
                type: "post_commented",
                content: `commented on your post.`,
                redirect_id: post._id,
            });
        }

        res.status(201).json({ success: true, message: "Comment added successfully.", comment: newComment });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// delete comment
// router.delete("/comment", authMiddleware, deleteComment);
export async function deleteComment(req, res) {
    try {
        console.log("/api/post/comment API Called");
        const { comment_id } = req.params;
        const { id: user_id } = req.user;

        if (!comment_id) {
            return res.status(400).json({ success: false, message: "Comment ID is required." });
        }

        const comment = await Comment.findById(comment_id);
        if (!comment) {
            console.log("Comment not found.");
            return res.status(404).json({ success: false, message: "Comment not found." });
        }

        if (comment.user_id.toString() !== user_id) {
            return res.status(403).json({ success: false, message: "You are not authorized to delete this comment." });
        }

        await comment.deleteOne();

        res.status(200).json({ success: true, message: "Comment deleted successfully." });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: error.message });
    }
}
