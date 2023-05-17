const express = require('express');
const router = express.Router();
const passport = require('passport');
require("../config/passportConfig")(passport);
const { likePost } = require('../controller/likeController');
/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     Post:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *           required: true
 *         author:
 *           type: string
 *           required: true
 *         picture:
 *           type: object
 *           properties:
 *             public_id:
 *               type: string
 *               required: true
 *             url:
 *               type: string
 *               required: true
 *         caption:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         likes:
 *           type: array
 *           items:
 *             type: string
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         comments:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               text:
 *                 type: string
 *               author:
 *                 type: string
 *               createdAt:
 *                 type: string
 *                 format: date-time
 *
 * paths:
 *   /likes/{postId}:
 *     post:
 *       summary: Add a new like
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: ID of the post to like on
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: User who has liked the post
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *       security:
 *         - bearerAuth: []
 */
router.post('/:postId', passport.authenticate('jwt', { session: false }), likePost);
module.exports = router;