const { ObjectId } = require('mongodb');
const { Category } = require("../aggregate");

module.exports = ({
    collections: {
        categories,
    }
}) => {
    return {
        async getAll() {
            try {
                const result = await categories.find({
                    isEnable: true,
                    isDeleted: false
                }).toArray();

                return [null, result.length ? result.map(r => new Category(r)) : null];

            } catch (error) {
                return [error];
            }
        },
    }
}