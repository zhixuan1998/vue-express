const { createController } = require("awilix-express");
const { generateSuccessResponse, generateErrorResponse } = require("../../utils/responseParser");
const errorMessages = require("../../errorMessages");

const controller = ({
    config,
    categoryRepository
}) => {

    return {
        async getCategories(req, res) {
            try {

                const [categoriesError, categories] = await categoryRepository.getAll();

                if (categoriesError)
                    throw categoriesError;

                let response = categories ? categories.map(r => {
                    return {
                        categoryId: r.getId(),
                        name: r.name
                    }
                }) : [];

                return res.status(200).send(generateSuccessResponse(response));

            } catch (err) {
                // console.log(err);
                return res.status(500).send(generateErrorResponse());
            }
        },
    };
};

module.exports = createController(controller)
    .prefix("/api")
    .get("/users/categories", "getCategories")
