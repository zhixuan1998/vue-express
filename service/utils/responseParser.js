const { general: generalErrorMessage } = require('../errorMessages');

function generateSuccessResponse(response = null, pagination = null) {
    let status = {
        code: 0,
        message: "Success"
    }

    if (!response) {
        return { status };
    }

    let data = Array.isArray(response) ? { results: response, pagination } : response;

    return { status, data };
}

function generateErrorResponse(...args) {
    let status = generalErrorMessage();

    args.map(arg => {
        // if (arg instanceof Error)
        //     return status.err = arg;

        status = { ...status, ...arg };
    })

    return { status }; 
}

module.exports = {
    generateSuccessResponse,
    generateErrorResponse
}