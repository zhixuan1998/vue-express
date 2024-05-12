import { ObjectId, Decimal128 } from "mongodb";

export default function ({ collections }) {
    return {
        async process() {
            const products = await collections.products.find({}).sort({ random: 1 }).toArray();
            const shops = await collections.shops.find({}).toArray();

            const shopIds = shops.map((r) => r._id);
            const chunk = Math.floor(products.length / shopNames);

            for (let i = 0; i < products.length; i += chunk) {
                const chunkProducts = products.slice(i, i + chunk);
                const productIds = chunkProducts.map((r) => r._id);

                collections.products.updateMany(
                    {
                        _id: { $in: productIds }
                    },
                    {
                        $set: {
                            shopId: shopIds[i / chunk]
                        }
                    }
                );
            }
        },

        async update({ collectionName, id, data }) {
            try {
                await collections[collectionName]?.updateOne({ _id: new ObjectId(id) }, { $set: data });
                return [null, true];
            } catch (error) {
                return [error];
            }
        }
    };
}
