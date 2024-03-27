const { createContainer, asValue, asFunction, listModules } = require("awilix");
const { loadControllers, scopePerRequest } = require('awilix-express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require("./appsettings.js");

const buildCollections = async () => {
    const client = new MongoClient(config.mongodb.default, {
        serverApi: {
            version: ServerApiVersion.v1,
            strict: true,
            deprecationErrors: true,
        }
    });

    await client.connect();
    const db = client.db("service");

    const users = db.collection("users");
    const address = db.collection("address");

    return {
        users,
        address,
    }
}

const container = createContainer();

async function setup() {
    const collections = await buildCollections();

    container.register({
        config: asValue(config),
        collections: asValue(collections),
        userRepository: asFunction(require("./repositories/userRepository.js"))
    });
    
}


module.exports = { container, setup };