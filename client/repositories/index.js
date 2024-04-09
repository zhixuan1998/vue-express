import createCategoryRepository from "./categoryRepository";
import createLookupRepository from "./lookupRepository";
import createUserRepository from "./userRepository";

export default (config) => ({
    categoryRepository: createCategoryRepository(config),
    lookupRepository: createLookupRepository(config),
    userRepository: createUserRepository(config)
})