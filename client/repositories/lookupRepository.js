
import httpClient from '@/utils/axiosConfigurator';

const lookupRepository = () => {
    return {
        async getCountryPhoneCodes() {
            return await httpClient.get(`/users/lookup/countries/phoneCodes`);
        }
    }
}

export default lookupRepository;