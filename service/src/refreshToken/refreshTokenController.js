const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const errorMessages = require("../../errorMessages");
const { RefreshToken } = require("../../aggregate");

const controller = ({
    config,
    userRepository,
    refreshTokenRepository
}) => {

    return {
        async generateNewToken(req, res) {
            try {
                const oldRefreshToken = req.body.refreshToken;

                const [deletedRefreshTokenError, deletedRefreshToken] =
                    await refreshTokenRepository.deleteRefreshToken(oldRefreshToken);

                if (deletedRefreshTokenError) throw deletedRefreshTokenError;

                if (!deletedRefreshToken) return res.status(400).send(generateErrorResponse());

                const [payloadError, payload] = deletedRefreshToken.getPayload(config.security.refreshTokenSecret);

                if (payloadError) throw payloadError;

                const userId = payload.id;

                const [userProfileError, userProfile] = await userRepository.get(userId);

                if (userProfileError) throw userProfileError;

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
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    };
};

module.exports = createController(controller).prefix("/api").post("/users/token", "generateNewToken");
