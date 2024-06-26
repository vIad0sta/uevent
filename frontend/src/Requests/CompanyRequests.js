import axiosInstance from "./AxiosInstance";

export default class CompanyRequests{
    static async addCompany(body){
        return axiosInstance.post(`/companies`, body);
    }
    static async editCompany(body){
        return axiosInstance.patch(`/companies`, body);
    }
    static async getCompanies(params){
        return axiosInstance.get(`/companies?${new URLSearchParams(params)}`);
    }
    static async getCompaniesByUser(userId, params){
        return axiosInstance.get(`/companies/users/${userId}?${new URLSearchParams(params)}`);
    }
    static async getCompany(companyId){
        return axiosInstance.get(`/companies/${companyId}`);
    }
}