const generatePagination = require("../../utils/pagination");

module.exports = ({
    config
}) => {
    return {
        async getListing({ queryFunction, limit = 10, page = 1, filterData = {} }) {
            try {
                const obj = {
                    listing: null,
                    pagination: null
                }

                if (typeof queryFunction != "function")
                    return [null, obj];

                limit = limit <= 0 ? 10 : limit;
                page = page <= 0 ? 1 : page;

                filterData.limit = limit + 1;
                filterData.skip = limit * (page - 1);

                const [listingError, listing] = await queryFunction(filterData);

                if (listingError)
                    throw listingError;

                const count = listing?.length ?? 0;

                if (page && limit) {
                    obj.pagination = generatePagination({ page, limit, count });
                }

                obj.listing = count > limit ? listing.slice(1, -1) : listing;

                return [null, obj];

            } catch (error) {
                return [error];
            }
        }
    }
}