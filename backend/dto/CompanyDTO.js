class CompanyDTO {
    constructor(data) {
        this.id = data.id
        this.name = data.name
        this.email = data.email
        this.poster = data.poster;
        this.UserId = data.UserId;
        this.location = data.location
    }
}
module.exports = CompanyDTO