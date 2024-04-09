import axios from 'axios';
import config from '../../appsettings';

const httpClient = axios.create({
    baseURL: config.service.baseURL
});

const httpClientToken = axios.create({
    baseURL: config.service.baseURL
});

const BASIC_AUTH = `Basic ${btoa(`${import.meta.env.VITE_BASIC_AUTH_ID}:${import.meta.env.VITE_BASIC_AUTH_SECRET}`)}`;

httpClientToken.defaults.headers['Authorization'] = BASIC_AUTH;

httpClient.interceptors.request.use(async (config) => {
    if (
        validateLocalStorageAuthInfo() &&
        new Date() > new Date(localStorage.getItem('accessTokenExpiredAt')) &&
        new Date() <= new Date(localStorage.getItem('refreshTokenExpiredAt'))
    ) {
        await refreshToken();
    }

    config.headers['Authorization'] =
        localStorage.getItem('accessToken') === null
            ? BASIC_AUTH
            : `Bearer ${localStorage.getItem('accessToken')}`;

    return config;
});

const validateLocalStorageAuthInfo = () => {
    try {
        if (
            !localStorage.getItem('accessToken') ||
            // !localStorage.getItem('user') ||
            new Date() > new Date(localStorage.getItem('refreshTokenExpiredAt'))
        ) {
            initLocalStorage();
            return false;
        }

        return true;
    } catch (err) {
        console.log(err);
    }
};

const refreshToken = async () => {
    await httpClientToken
        .post(`users/token`, { refreshToken: localStorage.getItem('refreshToken') })
        .then(({ data: { data } }) => {
            localStorage.setItem('accessToken', data.accessToken);
            localStorage.setItem('accessTokenExpiredAt', data.accessTokenExpiredAt);
            localStorage.setItem('refreshToken', data.refreshToken);
            localStorage.setItem('refreshTokenExpiredAt', data.refreshTokenExpiredAt);
        });
};

const initLocalStorage = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('accessTokenExpiredAt');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('refreshTokenExpiredAt');
    localStorage.removeItem('user');
};

validateLocalStorageAuthInfo();

export default httpClient;
