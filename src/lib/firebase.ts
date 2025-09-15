import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  "projectId": "studio-1218795519-c0d74",
  "appId": "1:876083877791:web:b22bfdc03e2e76b2bb8faa",
  "storageBucket": "studio-1218795519-c0d74.firebasestorage.app",
  "apiKey": "AIzaSyANxGxFipVYXB_O0Eo1LXsWj7TXdoYa_ao",
  "authDomain": "studio-1218795519-c0d74.firebaseapp.com",
  "measurementId": "",
  "messagingSenderId": "876083877791"
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);

export { app, auth };
