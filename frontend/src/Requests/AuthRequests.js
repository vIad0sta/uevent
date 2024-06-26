import axiosInstance from "./AxiosInstance";

export default class AuthRequests {
    static async sendVerificationCode(body) {
        return axiosInstance.post('/auth/login/sendVerificationCode', body);
    }

    static async sendEmailVerificationCode(code) {
        return axiosInstance.post('/auth/login/sendEmailVerificationCode', { code: code });
    }

    static async getVerificationCode(body) {
        return axiosInstance.post('/auth/login/getVerificationCode', body);
    }

    static async registration(body) {
        return axiosInstance.post('/auth/registration', body);
    }

    static async login(body) {
        return axiosInstance.post('/auth/login', body);
    }

    static async logout() {
        return axiosInstance.post('/auth/logout');
    }
}
