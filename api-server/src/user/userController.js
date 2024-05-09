const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const { User, Account, RefreshToken } = require("../../aggregate");
const errorMessages = require("../../errorMessages");
const { encrypt, hash } = require("../../utils/encryption");
const accountTypeEnum = require("../../enum/accountType");

const controller = ({ config, userRepository, accountRepository, refreshTokenRepository }) => {
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
                // console.log(err);
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

                const oldRefreshToken = req.cookies?.refreshToken;

                const [deleteRefreshTokenError, deleteRefreshToken] = await refreshTokenRepository.deleteRefreshToken({
                    userId,
                    token: oldRefreshToken
                });

                if (deleteRefreshTokenError) throw deleteRefreshTokenError;

                const { accessTokenSecret, accessTokenDurationInHour } = config.security;

                const { accessToken, accessTokenExpiredAt, fingerprint } = userProfile.generateToken(
                    accessTokenSecret,
                    accessTokenDurationInHour
                );

                const refreshTokenData = new RefreshToken({ userId: userId });

                const [createRefreshTokenError, createRefreshToken] =
                    await refreshTokenRepository.createRefreshToken(refreshTokenData);

                if (createRefreshTokenError) throw createRefreshTokenError;

                let response = { accessToken };

                return res
                    .status(200)
                    .cookie("refreshToken", refreshTokenData.token, {
                        expires: refreshTokenData.expiredAt,
                        httpOnly: true
                    })
                    .cookie("fingerprint", fingerprint, { expires: accessTokenExpiredAt, httpOnly: true })
                    .send(generateSuccessResponse(response));
            } catch (err) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },

        async register(req, res) {
            try {
                const { firstName, lastName, dob, email, password, phoneCode, phoneNumber } = req.body;

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
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },

        async socialLogin(req, res) {
            try {
                const { email, firstName, phoneNumber, firebaseUid, providerId } = req.body;

                const [existingAccountError, existingAccount] = await accountRepository.getByEmail(email);

                if (existingAccountError) throw existingAccountError;

                if (!existingAccount) {
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
                }

                return res.status(200).send(generateSuccessResponse());
            } catch (err) {
                // console.log(err);
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
                // console.log(err);
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
    .post("/users/socialLogin", "socialLogin")
    .put("/users", "updateUser")
    .delete("/users/disable", "disableUser");
