import { ObjectId } from "mongodb";
import { Category } from "../aggregate/index.js";

export default function ({ collections: { categories } }) {
    return {
        async getAll({ categoryIds }) {
            try {
                let query = {
                    isEnable: true,
                    isDeleted: false
                };

                if (categoryIds?.length) {
                    query._id = { $in: categoryIds.map((id) => new ObjectId(id)) };
                }

                const result = await categories.find(query).toArray();

                return [null, result.length ? result.map((r) => new Category(r)) : null];
            } catch (error) {
                return [error];
            }
        }
    };
}
