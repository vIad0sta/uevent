const commentService = require('../services/CommentService')

class CommentController{
    async updateComment(req, res, next){
        try{
            await commentService.updateComment(req.body);
            return res.status(204).send();
        }
        catch (e) {
            next(e)
        }
    }
    async deleteComment(req, res, next){
        try{
            await commentService.deleteComment(req.params.commentId);
            return res.status(204).send();
        }
        catch (e) {
            next(e)
        }
    }
}

module.exports = new CommentController();