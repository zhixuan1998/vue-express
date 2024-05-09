module.exports = {
    port: 8080,
    mongodb: {
        default: process.env.MONGODB__DEFAULT,
        log: process.env.MONGODB__LOG
    },
    security: {
        accessTokenSecret: process.env.SECURITY__ACCESS_TOKEN_SECRET,
        accessTokenDurationInHour: process.env.SECURITY__ACCESS_TOKEN_DURATION_IN_HOUR,
        encryption: {
            key: process.env.SECURITY__ENCRYPTION__KEY,
            iv: process.env.SECURITY__ENCRYPTION__IV
        }
    },
    firebase: {
        apiKey: process.env.FIREBASE__API_KEY
    }
};
