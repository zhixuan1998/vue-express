export default {
    service: {
        baseURL: process.env.SERVICE__BASE_URL,
        security: {
            clientId: process.env.SERVICE__SECURITY__CLIENT_ID,
            clientSecret: process.env.SERVICE__SECURITY__CLIENT_SECRET
        }
    },
    firebase: {
        config: {
            apiKey: process.env.FIREBASE__CONFIG__API_KEY,
            authDomain: process.env.FIREBASE__CONFIG__AUTH_DOMAIN,
            projectId: process.env.FIREBASE__CONFIG__PROJECT_ID,
            storageBucket: process.env.FIREBASE__CONFIG__STORAGE_BUCKET,
            messagingSenderId: process.env.FIREBASE__CONFIG__MESSAGING_SENDER_ID,
            appId: process.env.FIREBASE__CONFIG__APP_ID
        }
    },
}