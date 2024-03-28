import axios from 'axios';
import { ref } from 'vue';
import { defineStore } from 'pinia';
import config from '../../appsettings';


const httpClient = axios.create({
    baseURL: config.service.baseURL
});

const useUserStore = defineStore('userStore', () => {
    const user = ref(null);

    const login = async ({ email, password }) => {
        const result = await httpClient.post(`users/login`, { email, password });

        if (result?.data) {
            localStorage.setItem('accessToken', result.data.accessToken);
            localStorage.setItem('accessTokenExpiredAt', result.data.accessTokenExpiredAt);
            localStorage.setItem('refreshToken', result.data.refreshToken);
            localStorage.setItem('refreshTokenExpiredAt', result.data.refreshTokenExpiredAt);
        }

        await getUserProfile();
    }

    const register = async ({ firstName, lastName, phoneNumber, email, password }) => {
        const result = await httpClient.post(`users/register`, { firstName, lastName, phoneNumber, email, password });
        login({ email, password });
    }

    const getUserProfile = async () => {
        const headers = { authorization: `Bearer ${localStorage.getItem('accessToken')}` }; 
        const result = await httpClient.get(`users`, { headers });

        if (result?.data) {
            user.value = result.data;
            localStorage.setItem('user', user.value);
        }
    }

    const logout = async () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('accessTokenExpiredAt');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('refreshTokenExpiredAt');
        localStorage.removeItem('user');
    }

    return { login, logout, register, getUserProfile, user }

})

export default useUserStore;