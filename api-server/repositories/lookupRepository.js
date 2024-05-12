import { ObjectId } from "mongodb";

export default function ({ collections: { phoneCodes } }) {
    return {
        async getCountryPhoneCodes() {
            try {
                const result = await phoneCodes.find().toArray();

                return [null, result.length ? result : null];
            } catch (error) {
                return [error];
            }
        }
    };
}
