import axios from "axios";
import axiosInstance from "./AxiosInstance";

export default class EventRequests{
    static async addEvent(body){
        return axiosInstance.post(`/events`, body);
    }
    static async addComment(eventId, body){
        return axiosInstance.post(`/events/${eventId}/comments`, body);
    }
    static async getCommentsByEvent(eventId, params){
        return axiosInstance.get(`/events/${eventId}/comments?${new URLSearchParams(params)}`);
    }
    static async getAttendeesByEvent(eventId){
        return axiosInstance.get(`/events/${eventId}/attendees`);
    }
    static async addTicket(body){
        return axiosInstance.post(`/events/tickets`, body);
    }
    static async getEvents(params){
        return axiosInstance.get(`/events?${new URLSearchParams(params)}`);
    }
    static async getTickets(eventId){
        return axiosInstance.get(`/events/${eventId}/tickets`);
    }
    static async getEventsByCompany(companyId, params) {
        return axiosInstance.get(`/events/company/${companyId}?${new URLSearchParams(params)}`);
    }
    static async getSimilarEvents(theme) {
        return axiosInstance.get(`/events/company/similarEvents/${theme}`);
    }
    static async getEvent(eventId, params){
        return axiosInstance.get(`/events/${eventId}?${new URLSearchParams(params)}`);
    }
    static async updateEvent(body){
        return axiosInstance.patch(`/events/${body.id}`, body);
    }
    static async getEventFormats(){
        return axiosInstance.get(`/events/formats`);
    }
    static async getEventThemes(){
        return axiosInstance.get(`/events/themes`);
    }
    static async savePoster(formData){
        return  axiosInstance.post(`/events/poster`, formData);
    }
}