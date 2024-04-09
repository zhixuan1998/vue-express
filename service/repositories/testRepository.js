const { ObjectId } = require('mongodb');

module.exports = ({
    collections: {
        products,
        shops,
    }
}) => {
    return {
        async process() {
            const Products = await products.find({}).sort({ random: 1 }).toArray();
            const Shops = await shops.find({}).toArray();

            const shopIds = Shops.map(r => r._id);
            const chunk = Math.floor(Products.length / shopNames)

            for (let i = 0; i < products.length; i += chunk) {
                const chunkProducts = Products.slice(i, i + chunk);
                const productIds = chunkProducts.map(r => r._id);
                
                db.getCollection("products").updateMany({
                    _id: { $in: productIds }
                }, {
                    $set: {
                        shopId: shopIds[i / chunk]
                    }
                })
            }
        }
    }
}
