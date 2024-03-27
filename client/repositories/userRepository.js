import axios from 'axios';

const userRepository = (config) => {

    const httpClient = axios.create({
        baseURL: config.service.baseURL
    })

    return {
        async getUser (userId) {
            return await httpClient.get(`/users/${userId}`);
        }
    }
}

export default userRepository;