import httpClient from '@/utils/axiosConfigurator';

const brandRepository = (config) => {
    return {
        async getAll({ brandIds }) {
            return await httpClient.get("/users/brands", { brandIds });
        }
    }
}

export default brandRepository;