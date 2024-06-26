class CommentDTO {
    constructor(data) {
        this.id = data.id
        this.text = data.text
        this.creationTime = data.creationTime
        this.editTime = data.editTime
        this.UserId = data.UserId
    }
}
module.exports = CommentDTO