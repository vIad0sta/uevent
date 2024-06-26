import axiosInstance from "./AxiosInstance";

export default class CartRequests{
    static async getCart(cartId){
        return axiosInstance.get(`/carts/${cartId}`);
    }
    static async getCartTickets(cartId){
        return axiosInstance.get(`/carts/${cartId}/tickets`);
    }
    static async getCartTicketsAndEvents(cartId){
        return axiosInstance.get(`/carts/${cartId}/tickets-events`);
    }
    static async addCart(body){
        return axiosInstance.post(`/carts`, body);
    }
    static async addCartTicket(body){
        return axiosInstance.post(`/carts/${body.CartId}/tickets`, body);
    }
    static async updateCart(cart){
        return axiosInstance.patch(`/carts`, cart);
    }
    static async updateCartTicket(cartId, ticketId, ticket){
        return axiosInstance.patch(`/carts/${cartId}/tickets/${ticketId}`, ticket);
    }
    static async deleteCart(cartId){
        return axiosInstance.delete(`/carts/${cartId}`);
    }
    static async deleteCartTicket(cartId, ticketId){
        return axiosInstance.delete(`/carts/${cartId}/tickets/${ticketId}`);
    }
    static async clearCart(cartId){
        return axiosInstance.delete(`/carts/${cartId}/tickets`);
    }
}