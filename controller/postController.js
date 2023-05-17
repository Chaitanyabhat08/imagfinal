const asyncError = require("../middleware/asyncError");
const Post = require('../models/post');
const User = require('../models/user');

module.exports.getAllPosts = asyncError(async (req, res, next) => {
  try {
    const userId = User.userId;

    const userPosts = await Post.find({ author: userId }).select('author');
    const userPostIds = userPosts.map((post) => post.author.toString());

    const posts = await Post.find({ author: { $nin: userPostIds } })
      .sort({ createdAt: -1 })
      .populate('author');
    const feed = posts.map((post) => ({
      image: post.picture.url,
      caption: post.caption,
      author: post.author,
    }));

    res.status(200).json({ feed });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
