const { Router } = require('express');
const express = require('express');
const router = express.Router();
const {  loginUser, logoutUser, forgotPassword } = require("../controller/userController");
const User = require("../models/user");
const Post = require('../models/post');

const sendToken = require('../utils/jwttoken');
const ErrorHandler = require('../utils/errorhandler.js');
const passport = require("passport");
const cookieParser = require('cookie-parser');
const { JwtOptions } = require('../config/passportConfig');
const cloudinary = require('cloudinary');

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
router.get('/registerUser', (req, res) => {
  res.render('Register')
});
router.post('/register', upload.single('avatar'), async (req, res, next) => {
  const file = req.file;
  const myCloud = await cloudinary.v2.uploader.upload(file.location, {
    folder: "avatars",
    width: 150,
    crop: "scale",
  });
  const { name, email, password } = req.body;
  const existing = await User.findOne({ email });
  if (existing) {
    return next(new ErrorHandler("User already exists,Please Login", 11000));
  }
  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    },
  });
  let token = user.getJWTToken();
  token = `Bearer ${token}`;
  let url = `/posts/allposts?token=${encodeURIComponent(token)}`;
  res.redirect(url);
});
router.get('/loginUser', (req, res) => {
  res.render('Login');
});
router.post('/login', loginUser);
router.get('/logoutuser', logoutUser);
router.get('/profile', passport.authenticate('jwt', { session: false }), async (req, res) => {
  const posts = await Post.find({ author: req.user._id })
  res.json({
    user: req.user,
    posts: posts,
  });
});
router.get('/forgot_password', (req, res) => { 
  res.render('forgot_password')
})
router.post('/forgotpass', forgotPassword)
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         _id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         password:
 *           type: string
 *         avatar:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *             url:
 *               type: string
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * paths:
 *   /users/registerUser:
 *     get:
 *       summary: Render registration page
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *
 *   /users/register:
 *     post:
 *       summary: Register a new user
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *                 avatar:
 *                   type: string
 *                   format: binary
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *
 *   /users/loginUser:
 *     get:
 *       summary: Render login page
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             text/html:
 *               schema:
 *                 type: string
 *
 *   /users/login:
 *     post:
 *       summary: Login a user
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 email:
 *                   type: string
 *                 password:
 *                   type: string
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/User'
 *
 *   /users/logoutuser:
 *     get:
 *       summary: Logout the authenticated user
 *       responses:
 *         200:
 *           description: Successful operation
 *
 *   /users/profile:
 *     get:
 *       summary: Get user profile
 *       security:
 *         - bearerAuth: []
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 type: object
 *                 properties:
 *                   user:
 *                     $ref: '#/components/schemas/User'
 *                   posts:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Post'
 */

module.exports = router;