import httpClient from '@/utils/axiosConfigurator';

const brandRepository = (config) => {
    return {
        async getAll() {
            return await httpClient.get("/users/brands");
        }
    }
}

export default brandRepository;