export default {
    // General
    general: () => ({ code: 9999, message: "Internal server error." }),
    recordNotFound: (message = "Record not found.") => ({ code: 1001, message }),
    forbidden: () => ({ code: 1002, message: "Forbidden error." }),
    unauthorized: () => ({ code: 1003, message: "Unauthorized error." }),

    // Auth
    tokenExpired: () => ({ code: 1100, message: "Token expired." }),
    refreshTokenNotFound: () => ({ code: 1101, message: "Refresh token not found." }),
    fingerprintMismatch: () => ({ code: 1102, message: "Fingerprint mismatch." }),
    invalidFirebaseAccessToken: (errorCode) => {
        const messageByErrorCode = {
            "auth/id-token-expired": "Firebase access token expired.",
            "auth/argument-error": "Invalid firebase access token"
        };

        return { code: 1103, message: messageByErrorCode[errorCode] ?? messageByErrorCode["auth/argument-error"] };
    }
};

