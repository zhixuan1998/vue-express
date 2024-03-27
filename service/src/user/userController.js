const { createController } = require("awilix-express")
const { generateSuccessResponse, generateErrorResponse } = require('../../utils/responseParser');
const { User } = require('../../aggregate');
const errorMessages = require('../../errorMessages');

const controller = ({
    config,
    userRepository
}) => {
    return {
        async getUser(req, res, next) {
            try {

                const user = req.httpContext.user;

                if (!user)
                    return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));
    
                const userId = "65fb5c06473f1f4417b18293" || user.id;

                const [userProfileError, userProfile] = await userRepository.get(userId);

                if (userProfileError)
                    throw userProfileError;

                if (!userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                let response = {
                    userId: userProfile.getId(),
                };
    
                return res.status(200).send(generateSuccessResponse(response));

            } catch (err) {
                return res.status(500).send(generateErrorResponse(err));
            }
            
        },

        async login(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user)
                    return res.status(403).send(generateErrorResponse());
    
                const userId = user.id;
                const { email, password } = req.body;

                const [userProfileError, userProfile] = [];

                if (userProfileError)
                    throw userProfileError;

                if (userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));
    
                let response = {};
    
                return res.status(200).send(generateSuccessResponse(response));

            } catch (err) {
                return res.status(500).send(generateErrorResponse());
            }
        },

        async register(req, res) {
            try {
                return res.status(200).send(generateSuccessResponse());
            } catch (err) {
                return res.status(500).send(generateErrorResponse());
            }
        },

        async updateUser(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user)
                    return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [userProfileError, userProfile] = [];

                if (userProfileError)
                    throw userProfileError;

                if (userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                return res.status(200).send(generateSuccessResponse());
            } catch (err) {
                return res.status(500).send(generateErrorResponse());
            }
        },

        async disableUser(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user)
                    return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [userProfileError, userProfile] = [];

                if (userProfileError)
                    throw userProfileError;

                if (userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                return res.status(200).send(generateSuccessResponse());

            } catch (err) {
                return res.status(500).send(generateErrorResponse());
            }
        }

    };
}

module.exports = createController(controller)
    .prefix('/api')
    .get('/users', 'getUser')
    .post('/users/login', 'login')
    .post('/users/register', 'register')
    .put('/users', 'updateUser')
    .delete('/users/disable', 'disableUser')
