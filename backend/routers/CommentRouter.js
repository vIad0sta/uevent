const express = require('express');
const commentRouter = express.Router();
const jwtGenerator = require("../security/JwtGenerator");
const commentController = require('../controllers/CommentController')
const errorHandler = require("../ErrorHandler");

commentRouter.patch('/:commentId',  jwtGenerator.verifyToken, commentController.updateComment);
commentRouter.delete('/:commentId',  jwtGenerator.verifyToken, commentController.deleteComment);
commentRouter.use((err, req, res, next) => errorHandler(err, req, res, next));
module.exports = commentRouter;
