
import httpClient from '@/utils/axiosConfigurator';

const lookupRepository = () => {
    return {
        async getCountryPhoneCodes() {
            return await httpClient.get(`/users/lookup/countries/phoneCodes`);
        },

        async getSearchProductAreas() {
            return [
                { key: 'brand', value: 'Search within brand' },
                { key: 'category', value: 'Search within category' },
                { key: 'product', value: 'Search product'}
            ]
        }
    }
}

export default lookupRepository;