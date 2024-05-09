import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, GoogleAuthProvider, FacebookAuthProvider } from 'firebase/auth';
import config from '../../appsettings';

const PROVIDER_INSTANCE = {
    GOOGLE: GoogleAuthProvider,
    FACEBOOK: FacebookAuthProvider
};

const firebaseConfig = config.firebase;

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

function customConfiguration(provider, id) {
    let customParameters = {};

    switch (id) {
        case 'GOOGLE':
            provider.addScope('profile');
            break;
        // case 'FACEBOOK':
        //     provider.addScope('email');
        //     provider.addScope('user_birthday');
        //     customParameters.display = 'popup';
        //     break;
    }

    provider.setCustomParameters(customParameters);
}

function useFirebaseAuth(providerIds) {
    if (!Array.isArray(providerIds) || !providerIds?.length) return providerGroup;

    const providerGroup = providerIds.reduce((providerGroup, id) => {
        id = id.toUpperCase();

        let Provider = PROVIDER_INSTANCE[id];

        if (!Provider || providerGroup[id]) return providerGroup;

        let provider = new Provider();

        customConfiguration(provider, id);

        async function signIn() {
            try {
                const result = await signInWithPopup(auth, provider);
                const credential = Provider.credentialFromResult(result);
                const token = credential.accessToken;
                const user = result.user;
                return { user, token };
            } catch (error) {
                const errorCode = error.code;
                const errorMessage = error.message;
                const email = error.email;
                const credential = Provider.credentialFromError(error);
                return { errorCode, errorMessage, email, credential };
            }
        }

        providerGroup[id] = { signIn };

        return providerGroup;
    }, {});

    return providerGroup;
}

export default useFirebaseAuth;
