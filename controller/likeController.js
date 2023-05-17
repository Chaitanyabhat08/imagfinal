const Post = require('../models/post');

module.exports.likePost = async (req, res) => { 
  try {
    const { postId } = req.params;
    const { userId } = req.body;
    const like = {
      author: userId,
    };
    const post = await Post.findById(postId);
    post.likes.push(like);
    await post.save();
    res.status(200).json({ message: 'Like added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}