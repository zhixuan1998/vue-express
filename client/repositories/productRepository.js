import httpClient from '@/utils/axiosConfigurator';

const categoryRepository = (config) => {
    return {
        async getAll({ search, categoryIds, brandIds, shopIds, isFollowedBrand, isFollowedShop, isWishlist, limit = 30, page = 1 }) {
            return await httpClient.post('/users/products', {
                search,
                categoryIds,
                brandIds,
                shopIds,
                isFollowedBrand,
                isFollowedShop,
                isWishlist,
                limit,
                page
            });
        }
    };
};

export default categoryRepository;
