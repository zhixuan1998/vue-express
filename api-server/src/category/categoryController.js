const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const errorMessages = require("../../errorMessages");

const controller = ({ config, categoryRepository }) => {
    return {
        async getCategories(req, res) {
            try {
                const { categoryIds } = req.query;

                const [categoriesError, categories] = await categoryRepository.getAll({ categoryIds });

                if (categoriesError) throw categoriesError;

                let response = categories ? categories.map((r) => {
                    const categoryId = r.getId();

                    const { baseUrl } = config.image;
                    const { imageDirectoryPath } = config.category;

                    const imageUrl = new URL(imageDirectoryPath.replace("{categoryId}", categoryId), baseUrl).href;

                    return {
                        categoryId,
                        name: r.name,
                        imageUrl
                    };
                }) : [];

                return res.status(200).send(generateSuccessResponse(response));
            } catch (err) {
                console.error(err);
                return res.status(500).send(generateErrorResponse());
            }
        }
    };
};

module.exports = createController(controller).prefix("/api").get("/users/categories", "getCategories");
