const { ObjectId } = require("mongodb");
const { Product } = require("../aggregate");
const sortDirectionEnum = require("../enum/sortDirection");
const productSortByEnum = require("../enum/productSortBy");

module.exports = ({ collections: { products } }) => {
    return {
        async getAll({
            search,
            productIds,
            categoryIds,
            brandIds,
            shopIds,
            limit = 10,
            skip = 0,
            sortBy = productSortByEnum.NAME,
            sortDirection = sortDirectionEnum.ASC
        }) {
            try {
                let initQuery = {
                    isEnable: true,
                    isDeleted: false
                };

                if (search) {
                    initQuery.name = { $regex: "^" + search, $options: "i" };
                }

                if (productIds?.length) {
                    initQuery._id = { $in: productIds.map((id) => new ObjectId(id)) };
                }

                if (categoryIds?.length) {
                    initQuery.categoryIds = { $in: categoryIds.map((id) => new ObjectId(id)) };
                }

                if (brandIds?.length) {
                    initQuery.brandId = { $in: brandIds.map((id) => new ObjectId(id)) };
                }

                if (shopIds?.length) {
                    initQuery.shopId = { $in: shopIds.map((id) => new ObjectId(id)) };
                }

                const result = await products
                    .aggregate([{ $match: initQuery }])
                    .sort({ [sortBy]: sortDirection })
                    .skip(skip)
                    .limit(limit)
                    .toArray();

                return [null, result.length ? result.map((r) => new Product(r)) : null];
            } catch (error) {
                return [error];
            }
        }
    };
};
