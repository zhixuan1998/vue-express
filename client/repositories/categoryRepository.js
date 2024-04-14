import httpClient from '@/utils/axiosConfigurator';

const categoryRepository = (config) => {
    return {
        async getAll({ categoryIds }) {
            return await httpClient.get("/users/categories", { categoryIds });
        }
    }
}

export default categoryRepository;