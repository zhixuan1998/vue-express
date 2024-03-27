module.exports = {
    // General
    general: () => ({ code: 9999, message: "Internal server error." }),
    recordNotFound: (message = "Record not found.") => ({ code: 1001, message }),
    forbidden: () => ({ code: 1002, message: "Forbidden error." }),
    unauthorized: () => ({ code: 1003, message: "Unauthorized error." }),

}