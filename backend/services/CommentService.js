const {Comment} = require('../models')
const CommentDTO = require('../dto/CommentDTO')
const EventDTO = require("../dto/EventDTO");

class CommentService{
    async addComment(comment, userId){
        let newComment = new Comment(comment);
        newComment.UserId = userId;
        return new CommentDTO( await newComment.save());
    }
    async updateComment(comment){
        await Comment.update(comment, {
            where: {id: comment.id}
        });
    }
    async deleteComment(commentId){
        await Comment.destroy({
            where: {id: commentId}
        });
    }
    async getCommentsByEvent(eventId, query){
        const offset = (query.page - 1) * query.pageSize;
        const limit = parseInt(query.pageSize);
        let comments = await Comment.findAndCountAll({
            where: {EventId: eventId},
            offset,
            limit
        })
        return {comments: comments.rows.map(comment => new CommentDTO(comment)), commentCount: comments.count}
    }
}

module.exports = new CommentService();