import { createController } from "awilix-express";
import { generateSuccessResponse, generateErrorResponse } from "../../utils/responseParser.js";
import errorMessages from "../../errorMessages.js";
import { Brand } from "../../aggregate/index.js";
import followTypeEnum from "../../enum/followType.js";

const controller = ({ config, brandRepository, followRepository }) => {
    return {
        async getBrands(req, res) {
            try {
                const { brandIds } = req.query;

                const [brandsError, brands] = await brandRepository.getAll({ brandIds });

                if (brandsError) throw brandsError;

                let response = brands
                    ? brands.map((r) => {
                          return {
                              brandId: r.getId(),
                              name: r.name,
                              imageUrl: r.imageUrl
                          };
                      })
                    : [];

                return res.status(200).send(generateSuccessResponse(response));
            } catch (err) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },

        async getUserFollowed(req, res) {
            try {
                const user = req.httpContext.user;

                if (!user) return res.status(403).send(generateErrorResponse(errorMessages.forbidden()));

                const userId = user.id;

                const [followsError, follows] = await followRepository.getAllWithReferenceObject({
                    type: followTypeEnum.BRAND,
                    userId
                });

                if (followsError) throw followsError;

                let response = follows
                    ? follows.map((r) => {
                          const brand = new Brand(r.referenceObject);

                          return {
                              brandId: brand.getId(),
                              name: brand.name
                          };
                      })
                    : [];

                return res.status(200).send(generateSuccessResponse(response));
            } catch (err) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    };
};

export default createController(controller)
    .prefix("/api")
    .get("/users/brands", "getBrands")
    .get("/users/followedBrands", "getUserFollowedBrands");
