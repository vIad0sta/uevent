import axiosInstance from "./AxiosInstance";

export default class UserRequests{
    static async getUser(){
        return axiosInstance.get(`/users`);
    }
    static async getTickets(){
        return axiosInstance.get(`/users/tickets`);
    }
    static async getCompanySubscription(companyId){
        return axiosInstance.get(`/users/company-subscription/${companyId}`);
    }
    static async getEvents(){
        return axiosInstance.get(`/users/events`);
    }
    static async getCart(){
        return axiosInstance.get(`/users/cart`);
    }
    static async subscribeToCompany(body){
        return axiosInstance.post(`/users/company`, body);
    }
    static async getUserById(id){
        return axiosInstance.get(`/users/${id}`);
    }
    static async deleteUser(){
        return axiosInstance.delete(`/users`);
    }
    static async editUser(body){
        return axiosInstance.patch(`/users`, body);
    }
    static async updateUserPassword(body){
        return axiosInstance.patch(`/users/update-password`, body);
    }
    static async editBoughtTicket(id,body){
        return axiosInstance.patch(`/users/tickets/${id}`, body);
    }
    static async updateUserAvatar(formData){
        return  axiosInstance.patch(`/users/avatar`, formData);
    }
    static async sendRestoringPasswordEmail(email) {
        return axiosInstance.post(`/users/send-restore-email`,{ email })
    }
}