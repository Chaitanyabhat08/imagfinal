const express = require('express');
const router = express.Router();
const commentController = require('../controller/commentController');
const passport = require('passport');
require("../config/passportConfig")(passport);
/**
 * @swagger
 * components:
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
 *   /comments/{postId}:
 *     post:
 *       summary: Create a new comment and likes
 *       parameters:
 *         - in: path
 *           name: postId
 *           required: true
 *           description: ID of the post to comment on
 *           schema:
 *             type: string
 *       requestBody:
 *         required: true
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 text:
 *                   type: string
 *                   description: Comment text
 *                 author:
 *                   type: string
 *                   description: Author of the comment
 *                 userId:
 *                   type: string
 *                   description: User of the comment
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                   description: Creation date of the comment
 *       responses:
 *         200:
 *           description: Successful operation
 *           content:
 *             application/json:
 *               schema:
 *                 $ref: '#/components/schemas/Post'
 *       security:
 *         - bearerAuth: []
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 */
router.post('/:postId', commentController.createComment);

module.exports = router;
