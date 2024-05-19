module.exports = {
    port: 8080,
    origin: process.env.ORIGIN,
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
    },
    image: {
        baseUrl: process.env.IMAGE__BASE_URL,
    },
    brand: {
        imageDirectoryPath: process.env.BRAND__IMAGE_DIRECTORY_PATH,
    },
    product: {
        imageDirectoryPath: process.env.PRODUCT__IMAGE_DIRECTORY_PATH,
    },
    category: {
        imageDirectoryPath: process.env.CATEGORY__IMAGE_DIRECTORY_PATH,
    }
};
