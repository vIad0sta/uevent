import axios from 'axios';
import AuthRequests from "./AuthRequests";

const axiosInstance = axios.create({
    withCredentials: true,
    baseURL: `https://localhost:3001/api`
});

axiosInstance.interceptors.request.use(
    async config => {
        if(config.url.includes('auth')) return config;
        const expiredAt = localStorage.getItem('expiredAt');
        if (expiredAt && new Date(Date.now()) >= new Date(Date.parse(expiredAt))) {
           const response = await axios.post(`https://localhost:3001/api/auth/refresh-access`, {}, {withCredentials: true});
           localStorage.setItem('expiredAt', response.data.expiredAt)
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        if (error.response) {
            if (error.response.status === 401) {
                localStorage.clear();
                window.location.href = '/sign-in'
            }
            else if (error.response.status === 403) {
                console.log("Forbidden access");
                return Promise.resolve(error.response);
            } else if(!error.config.url.includes('api/auth/login')){
                window.location.href = `/error?error=${error.response.data.error}`;
            }
        } else {
            return Promise.reject(error);
        }
    }
);



export default axiosInstance;