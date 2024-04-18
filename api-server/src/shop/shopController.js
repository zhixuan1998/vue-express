const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const errorMessages = require("../../errorMessages");
const { Shop } = require("../../aggregate");
const followTypeEnum = require("../../enum/followType");

const controller = ({
    config,
    followRepository,
    shopRepository
}) => {
    
    return {
        async getShops(req, res) {
            try {

            } catch (error) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },

        async getUserFollowedShops(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user)
                    return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [followsError, follows] = await followRepository.getAllWithReferenceObject({
                    type: followTypeEnum.SHOP,
                    userId
                });

                if (followsError)
                    throw followsError;

                let response = follows ? follows.map(r => {
                    const shop = new Shop(r.referenceObject);

                    return {
                        shopId: shop.getId(),
                        name: shop.name
                    }
                }) : [];

                return res.status(200).send(generateSuccessResponse(response));

            } catch (error) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    }
}

module.exports = createController(controller)
    .prefix("/api")
    .get("/users/shops", "getShops")
    .get("/users/followedShops", "getUserFollowedShops")
