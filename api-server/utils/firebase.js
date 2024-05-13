import { initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import config from '../appsettings';

const app = initializeApp(config.firebaseconfig);
const auth = getAuth(app);

export { auth };
