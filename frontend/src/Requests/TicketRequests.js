import axiosInstance from "./AxiosInstance";
const url = `http://localhost:3001/api/tickets`

export default class TicketRequests {
    static async createAndSendTicket(cartId, user){
        return axiosInstance.post(`/tickets/buy-ticket/${cartId}`,user);
    }
    static async saveBoughtTicket(cartId, body){
        return axiosInstance.post(`/tickets/cart/${cartId}`,body);
    }

}