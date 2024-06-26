import axiosInstance from "./AxiosInstance";

export default class CommentRequests{
    static async updateComment(comment){
        return axiosInstance.patch(`/comments/${comment.id}`, comment);
    }
    static async deleteComment(commentId){
        return axiosInstance.delete(`/comments/${commentId}`);
    }
}