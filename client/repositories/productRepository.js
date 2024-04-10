import httpClient from '@/utils/axiosConfigurator';

const categoryRepository = (config) => {
    return {
        async getAll({ search, categoryIds, brandIds, shopIds, isFollowedBrand, isFollowedShop, isWishlist }) {
            return await httpClient.post('/users/products', {
                search,
                categoryIds,
                brandIds,
                shopIds,
                isFollowedBrand,
                isFollowedShop,
                isWishlist
            });
        }
    };
};

export default categoryRepository;
