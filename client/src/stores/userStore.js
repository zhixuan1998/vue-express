import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '@/utils/axiosConfigurator';

const useUserStore = defineStore('userStore', () => {
    const user = ref(
        localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
    );

    const login = async ({ email, password }) => {
        const encodedPassword = btoa(password);

        const success = await httpClient
            .post(`users/login`, { email, password: encodedPassword })
            .then(async ({ data: { data } }) => {
                localStorage.setItem('accessToken', data.accessToken);
                localStorage.setItem('accessTokenExpiredAt', data.accessTokenExpiredAt);
                localStorage.setItem('refreshToken', data.refreshToken);
                localStorage.setItem('refreshTokenExpiredAt', data.refreshTokenExpiredAt);

                await getUser();
                return true;
            })
            .catch((err) => {
                return false;
            });

        return success;
    };

    const register = async ({ firstName, lastName, email, dob, phoneCode, phoneNumber, password }) => {
        const encodedPassword = btoa(password);

       const success = await httpClient
            .post(`users/register`, {
                firstName,
                lastName,
                email,
                dob,
                phoneCode,
                phoneNumber,
                password: encodedPassword
            })
            .then(() => {
                login({ email, password });
                return true;
            })
            .catch((err) => {
                return false;
            });

        return success;
    };

    const getUser = async () => {
            await httpClient
            .get(`users`)
            .then(({ data: { data } }) => {
                if (!data) return;

                user.value = data;
                localStorage.setItem('user', JSON.stringify(data));
            })
            .catch((err) => {});
    };

    const logout = async () => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };

        await httpClient.post(`users/logout`, { headers }).then(() => {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('accessTokenExpiredAt');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('refreshTokenExpiredAt');
            localStorage.removeItem('user');
        });
    };

    return { login, register, getUser, logout, user };
});

export default useUserStore;
