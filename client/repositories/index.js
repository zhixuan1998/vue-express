import createCategoryRepository from "./categoryRepository";
import createLookupRepository from "./lookupRepository";
import createBrandRepository from "./brandRepository";
import createUserRepository from "./userRepository";

export default (config) => ({
    categoryRepository: createCategoryRepository(config),
    lookupRepository: createLookupRepository(config),
    brandRepository: createBrandRepository(config),
    userRepository: createUserRepository(config)
})