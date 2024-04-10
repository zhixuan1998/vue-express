import createCategoryRepository from "./categoryRepository";
import createProductRepository from "./productRepository";
import createLookupRepository from "./lookupRepository";
import createBrandRepository from "./brandRepository";
import createUserRepository from "./userRepository";

export default (config) => ({
    categoryRepository: createCategoryRepository(config),
    productRepository: createProductRepository(config),
    lookupRepository: createLookupRepository(config),
    brandRepository: createBrandRepository(config),
    userRepository: createUserRepository(config)
})