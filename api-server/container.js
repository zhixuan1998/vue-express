import { createContainer, asValue, Lifetime } from "awilix";
import { MongoClient, ServerApiVersion } from "mongodb";
import config from "./appsettings.js";

async function buildCollections() {
    const client = new MongoClient(config.mongodb.default, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true
        }
    });

    await client.connect();
    const db = client.db("service");

    const accounts = db.collection("accounts");
    const address = db.collection("address");
    const brands = db.collection("brands");
    const categories = db.collection("categories");
    const follows = db.collection("follows");
    const phoneCodes = db.collection("phoneCodes");
    const products = db.collection("products");
    const refreshTokens = db.collection("refreshTokens");
    const shops = db.collection("shops");
    const users = db.collection("users");
    const wishlists = db.collection("wishlists");

    return {
        accounts,
        address,
        brands,
        categories,
        follows,
        phoneCodes,
        products,
        refreshTokens,
        shops,
        users,
        wishlists
    };
}

const container = createContainer();

async function setup() {
    const collections = await buildCollections();

    await container.loadModules(["repositories/*Repository.js"], {
        resolverOptions: { lifetime: Lifetime.SINGLETON },
        esModules: true
    });

    container.register({
        config: asValue(config),
        collections: asValue(collections)
    });
}

export { container, setup };
