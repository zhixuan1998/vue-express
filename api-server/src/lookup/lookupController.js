import { createController } from "awilix-express";
import { generateSuccessResponse, generateErrorResponse } from "../../utils/responseParser.js";
import errorMessages from "../../errorMessages.js";

const controller = ({
    config,
    lookupRepository
}) => {

    return {
        async getCountryPhoneCodes(req, res) {
            try {
                const [phoneCodesError, phoneCodes] = await lookupRepository.getCountryPhoneCodes();
                    
                let response = phoneCodes.length ? phoneCodes.map(c => {
                    return  {
                        code: c.code,
                        name: c.name,
                        phoneCode: c.phoneCode
                    }
                }) : [];

                return res.status(200).send(generateSuccessResponse(response));

            } catch (err) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    }
}
export default createController(controller)
    .prefix("/api/users/lookup")
    .get("/countries/phoneCodes", "getCountryPhoneCodes")