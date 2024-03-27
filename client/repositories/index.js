import createLookupRepository from "./lookupRepository";
import createUserRepository from "./userRepository";

export default (config) => ({
    lookupRepository: createLookupRepository(config),
    userRepository: createUserRepository(config)
})