export default {
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
    firebaseconfig: {
        apiKey: process.env.FIREBASECONFIG__API_KEY,
        authDomain: process.env.FIREBASECONFIG__AUTH_DOMAIN,
        projectId: process.env.FIREBASECONFIG__PROJECT_ID,
        storageBucket: process.env.FIREBASECONFIG__STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASECONFIG__MESSAGING_SENDER_ID,
        appId: process.env.FIREBASECONFIG__APP_ID
    }
};
