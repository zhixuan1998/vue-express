import { createController } from "awilix-express";
import { generateSuccessResponse, generateErrorResponse } from "../../utils/responseParser.js";
import errorMessages from "../../errorMessages.js";

const controller = ({ config, categoryRepository }) => {
    return {
        async getCategories(req, res) {
            try {
                const { categoryIds } = req.query;

                const [categoriesError, categories] = await categoryRepository.getAll({ categoryIds });

                if (categoriesError) throw categoriesError;

                let response = categories
                    ? categories.map((r) => {
                          return {
                              categoryId: r.getId(),
                              name: r.name,
                              imageUrl: r.imageUrl
                          };
                      })
                    : [];

                return res.status(200).send(generateSuccessResponse(response));
            } catch (err) {
                console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    };
};
export default createController(controller).prefix("/api").get("/users/categories", "getCategories");
