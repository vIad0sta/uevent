const {User, EventAttendees, CompanySubscription} = require('../models');
const UserDTO = require("../dto/UserDTO");
class UserService{
    async getUserByEmail(email){
        return new UserDTO(await User.findOne({
            where: {email : email}
        }))
    }
    async getUserById(id){
        return new UserDTO(await User.findByPk(id))
    }
    async getUserMfaSecretById(id) {
        let user = await User.findByPk(id)
        return user.mfaSecret
    }
    async getCompanySubscription(userId, companyId){
        return  await CompanySubscription.findOne({
            where: {
                UserId: userId,
                CompanyId: companyId
            }
        });
    }
    async getCompanySubscriptions(companyId){
        return  await CompanySubscription.findAll({
            where: {
                CompanyId: companyId
            }
        });
    }
    async getUserByUsername(username){
        return new UserDTO(await User.findOne({
            where: {username : username}}))
    }
    async getUserForLogin(username){
        return await User.findOne({
            where: {username : username}});
    }
    async addUser(user){
        return new UserDTO(await User.create(user));
    }
    async subscribeToCompany(user, companyId){
        return await CompanySubscription.create({UserId: user.id, CompanyId: companyId});
    }
    async updateUser(user_id, user){
        return await User.update(user, {
            where: { id: user_id }
        });
    }
    async updateUserPassword(userId, password){
        return await User.update(
            {password: password},
            {where: {id: userId}}
        );
    }
    async updateBoughtTicket(id, visible) {
        await EventAttendees.update(
            {visible: visible},
            {where: {id: id}}
        );
    }
    async updateAvatar(user_id, newAvatar) {
         await User.update(
            {avatar: newAvatar},
            {where: {id: user_id}}
        );
    }
    async unsubscribeFromCompany(id){
        return await CompanySubscription.destroy({
            where: { id: id }
        });
    }
    async deleteUser(user_id){
        const user = await User.findByPk(user_id);
        if (user) {
            await user.destroy();
        }
    }
}
module.exports = new UserService();