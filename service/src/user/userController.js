const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const { User, Account, RefreshToken } = require("../../aggregate");
const errorMessages = require("../../errorMessages");
const { encrypt } = require("../../utils/encryption");

const controller = ({
    config,
    userRepository,
    accountRepository,
    refreshTokenRepository
}) => {

    return {
        async getUser(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user) return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [userProfileError, userProfile] = await userRepository.get(userId);

                if (userProfileError) throw userProfileError;

                if (!userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                let response = {
                    userId: userProfile.getId(),
                    firstName: userProfile.firstName,
                    lastName: userProfile.lastName,
                    gender: userProfile.gender,
                    dob: userProfile.dob.toISOString(),
                    email: userProfile.email,
                    phoneCode: userProfile.phoneCode,
                    phoneNumber: userProfile.phoneNumber,
                    isActivated: userProfile.isActivated
                };

                return res.status(200).send(generateSuccessResponse(response));
            } catch (err) {
                console.log(err)
                return res.status(500).send(generateErrorResponse(err));
            }
        },

        async login(req, res) {
            try {

                const { email, password } = req.body;

                const [accountError, account] = await accountRepository.getByEmail(email);

                if (accountError) throw accountError;

                if (!account)
                    return res
                        .status(404)
                        .send(generateErrorResponse(errorMessages.recordNotFound("Account not found.")));

                const decodedPassword = atob(password);

                if (!account.verifyAuthentication(decodedPassword, config.security.encryption))
                    return res.status(400).send(generateErrorResponse());

                const userId = account.getUserId();

                const [userProfileError, userProfile] = await userRepository.get(userId);

                if (userProfileError) throw userProfileError;

                if (!userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                const [loginError, login] = await userRepository.login(userId);

                if (loginError) throw loginError;

                const [deleteRefreshTokenError, deleteRefreshToken] =
                    await refreshTokenRepository.deleteRefreshToken(userId);

                if (deleteRefreshTokenError) throw deleteRefreshTokenError;

                let response = userProfile.getToken(
                    config.security.accessTokenSecret,
                    config.security.refreshTokenSecret
                );

                const refreshTokenData = new RefreshToken({
                    userId: userId,
                    token: response.refreshToken,
                    expiredAt: response.refreshTokenExpiredAt
                });

                const [createRefreshTokenError, createRefreshToken] =
                    await refreshTokenRepository.createRefreshToken(refreshTokenData);

                if (createRefreshTokenError) throw createRefreshTokenError;

                return res.status(200).send(generateSuccessResponse(response));
            } catch (err) {
                console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },

        async register(req, res) {
            try {
                const { firstName, lastName, gender, dob, email, password, phoneCode, phoneNumber } = req.body;

                const [existingAccountError, existingAccount] = await accountRepository.getByEmail(email);

                if (existingAccountError) throw existingAccountError;

                if (existingAccount) return res.status(400).send(generateErrorResponse());

                const [existingUsersError, existingUsers] = await userRepository.getByPhone(phoneCode, phoneNumber);

                if (existingUsersError) throw existingUsersError;

                if (existingUsers) return res.status(400).send(generateErrorResponse());

                const decodedPassword = atob(password);

                const { key, iv } = config.security.encryption;

                const encrypted = encrypt(decodedPassword, key, iv);

                const userData = new User({
                    firstName,
                    lastName,
                    gender,
                    dob: new Date(dob),
                    email,
                    phoneCode,
                    phoneNumber
                });

                const [createUserError, createUser] = await userRepository.createUser(userData);

                if (createUserError) throw createUserError;

                const accountData = new Account({
                    userId: createUser.getId(),
                    email,
                    password: encrypted
                });

                const [createAccountError, createAccount] = await accountRepository.createAccount(accountData);

                if (createAccountError) throw createAccountError;

                return res.status(200).send(generateSuccessResponse());
            } catch (err) {
                console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },

        async updateUser(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user) return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [userProfileError, userProfile] = await userRepository.get(userId);

                if (userProfileError) throw userProfileError;

                if (userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                const [updateUserError, updateUser] = await userRepository.updateUser(userId, req.body);

                if (updateUserError) throw updateUserError;

                return res.status(200).send(generateSuccessResponse());
            } catch (err) {
                return res.status(500).send(generateErrorResponse());
            }
        },

        async disableUser(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user) return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [userProfileError, userProfile] = await userRepository.get(userId);

                if (userProfileError) throw userProfileError;

                if (userProfile)
                    return res.status(404).send(generateErrorResponse(errorMessages.recordNotFound("User not found.")));

                // TODO: check incomplete order

                const [disableUserError, disableUser] = await userRepository.disableUser(userId);

                if (disableUserError) throw disableUserError;

                const [deleteAccountsError, deleteAccounts] = await accountRepository.deleteAccounts(userId);

                if (deleteAccountsError) throw deleteAccountsError;

                return res.status(200).send(generateSuccessResponse());
            } catch (err) {
                return res.status(500).send(generateErrorResponse());
            }
        }
    };
};

module.exports = createController(controller)
    .prefix("/api")
    .get("/users", "getUser")
    .post("/users/login", "login")
    .post("/users/register", "register")
    .put("/users", "updateUser")
    .delete("/users/disable", "disableUser");
