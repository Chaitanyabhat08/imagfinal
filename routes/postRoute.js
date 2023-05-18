const { Router } = require('express');
const express = require('express');
const router = express.Router();

const passport = require('passport');
require("../config/passportConfig")(passport);
const { getAllPosts, createPost } = require("../controller/postController");
const Post = require('../models/post');

const dotenv = require('dotenv');
dotenv.config({ path: '../config/.env' });

const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");
const { Readable } = require("stream");

const s3 = new AWS.S3({
  accessKeyId: 'AKIAZVTLPFXVZNC2NNFL',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'projectbuckettt',
    acl: 'public-read',
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString());
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB file size limit
  },
});

router.post('/create', passport.authenticate('jwt', { session: false }), upload.single('image'), async (req, res) => {
  try {
    const file = req.file;
    const user = req.user;

    if (!file || !file.originalname) {
      throw new Error('No file or originalname property found');
    }

    const newPost = await Post.create({
      title: req.body.title,
      caption: req.body.caption,
      picture: {
        public_id: file.originalname,
        url: file.location,
      },
      author: user._id, // the _id of the author User document
      likes: [],
      comments: [],
    });

    let token = user.tokens[user.tokens.length - 1].token;
    token = `Bearer ${token}`;
    let url = `/posts/allposts?token=${encodeURIComponent(token)}`;
    res.status(200).json({ url: url });

  } catch (error) {
    console.error(error);
    // Handle the error and send an appropriate response
    res.status(500).json({ error: 'Error creating post' });
  }
});
router.get('/createPost', passport.authenticate('jwt', { session: false }), (req, res) => {
  const token = req.headers.Authorization;
  res.render('createpost', { token });
});

router.get('/postFeed', (req, res) => {
  getAllPosts(req, res);
});
router.get('/allposts', async (req, res) => {
  // Retrieve posts data from your database or other source
  const posts = await Post.find().sort({ date: -1 }).lean();
  const token = req.query.token;
  // Pass the posts data to the EJS file using the render method
  res.render('PostFeed', { posts });

});
/**
 * @swagger
 * components:
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         title:
 *           type: string
 *         author:
 *           type: string
 *         picture:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *             url:
 *               type: string
 *         caption:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *
 * paths:
 *   /posts/postFeed:
 *     get:
 *       summary: Get all posts
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Post'
 *   /posts/allposts:
 *     get:
 *       summary: Get all posts
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *   /posts/create:
 *     put:
 *       summary: Create a new post
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 title:
 *                   type: string
 *                 caption:
 *                   type: string
 *                 image:
 *                   type: string
 *                   format: binary
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 */
module.exports = router;