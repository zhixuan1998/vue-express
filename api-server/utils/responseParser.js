import errorMessages from "../errorMessages.js";

function generateSuccessResponse(response = null, pagination = null) {
    let status = {
        code: 0,
        message: "Success"
    };

    if (!response) {
        return { status };
    }

    let data = {};

    if (Array.isArray(response)) {
        data.results = response;

        if (pagination) {
            data.pagination = pagination;
        }
    } else {
        data = response;
    }

    return { status, data };
}

function generateErrorResponse(...args) {
    let status = errorMessages.general();

    args.map((arg) => {
        // if (arg instanceof Error)
        //     return status.err = arg;

        status = { ...status, ...arg };
    });

    return { status };
}

export { generateSuccessResponse, generateErrorResponse };
