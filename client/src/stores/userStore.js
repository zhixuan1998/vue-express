import { ref } from 'vue';
import { defineStore } from 'pinia';
import httpClient from '@/utils/http';

const useUserStore = defineStore('userStore', () => {
    const user = ref();

    const login = async ({ email, password }) => {
        const encodedPassword = btoa(password);

        const success = await httpClient
            .post(`users/login`, { email, password: encodedPassword })
            .then(async ({ data: { data } }) => {
                localStorage.setItem('accessToken', data.accessToken);
                await getUser();
                return true;
            })
            .catch(() => {
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
            .catch(() => {
                return false;
            });

        return success;
    };

    const socialLogin = async ({ accessToken, provider }) => {
        const success = await httpClient
            .post(`users/socialLogin`, {
                accessToken,
                provider
            })
            .then(async ({ data: { data } }) => {
                localStorage.setItem('accessToken', data.accessToken);
                await getUser();
                return true;
            })
            .catch(() => {
                return false;
            });

        return success;
    };

    const getUser = async () => {
        if (!localStorage.getItem('accessToken')) return;

        await httpClient
            .get(`users`)
            .then(({ data: { data } }) => {
                if (!data) return;

                user.value = data;
            })
            .catch(() => {});
    };

    const logout = async () => {
        const headers = { Authorization: `Bearer ${localStorage.getItem('accessToken')}` };

        await httpClient.post(`users/logout`, { headers }).then(() => {
            localStorage.removeItem('accessToken');
        });
    };

    getUser();

    return { login, register, socialLogin, getUser, logout, user };
});

export default useUserStore;
