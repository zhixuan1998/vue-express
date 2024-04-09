import httpClient from '@/utils/axiosConfigurator';

const categoryRepository = (config) => {
    return {
        async getAll() {
            return await httpClient.get("/users/categories");
        }
    }
}

export default categoryRepository;