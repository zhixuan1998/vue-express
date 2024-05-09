export default {
    service: {
        baseURL: import.meta.env.VITE_SERVICE__BASE_URL,
        security: {
            clientId: import.meta.env.VITE_SERVICE__SECURITY__CLIENT_ID,
            clientSecret: import.meta.env.VITE_SERVICE__SECURITY__CLIENT_SECRET
        }
    },
    firebase: {
        apiKey: import.meta.env.VITE_FIREBASE__API_KEY,
        authDomain: import.meta.env.VITE_FIREBASE__AUTH_DOMAIN,
        projectId: import.meta.env.VITE_FIREBASE__PROJECT_ID,
        storageBucket: import.meta.env.VITE_FIREBASE__STORAGE_BUCKET,
        messagingSenderId: import.meta.env.VITE_FIREBASE__MESSAGING_SENDER_ID,
        appId: import.meta.env.VITE_FIREBASE__APP_ID
    }
}