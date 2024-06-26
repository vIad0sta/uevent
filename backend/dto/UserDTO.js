class UserDTO {
    constructor(data) {
        this.id = data.id;
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.email = data.email;
        this.username = data.username;
        this.role = data.role
        this.avatar = data.avatar
        this.isMfaEnabled = data.isMfaEnabled
        this.isEmailVerified = data.isEmailVerified
    }
}
module.exports = UserDTO