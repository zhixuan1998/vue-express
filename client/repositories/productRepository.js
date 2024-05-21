import httpClient from '@/utils/http';

const categoryRepository = (config) => {
    return {
        async getAll({ search, categoryIds, brandIds, shopIds, isFollowedBrand, isFollowedShop, isWishlist, limit = 30, page = 1 }, signal = null) {
            return await httpClient.post(
                '/users/products',
                {
                    search,
                    categoryIds,
                    brandIds,
                    shopIds,
                    isFollowedBrand,
                    isFollowedShop,
                    isWishlist,
                    limit,
                    page
                },
                {
                    signal
                }
            );
        }
    };
};

export default categoryRepository;
