const Post = require('../models/post');

module.exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment, userId } = req.body;
    const commentTobestored = {
      text: comment,
      post: postId, 
      author: userId,
    };

    const post = await Post.findById(postId);
    post.comments.push(commentTobestored);
    await post.save();
    res.status(200).json({ message: 'Comment added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
