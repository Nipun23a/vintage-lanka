import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBX8vDegpFQrD7JF8i3pCi5xgAfG62AHyo",
    authDomain: "vintage-lanka.firebaseapp.com",
    projectId: "vintage-lanka",
    storageBucket: "vintage-lanka.firebasestorage.app",
    messagingSenderId: "411758609369",
    appId: "1:411758609369:web:ba794b388e6b0b38798fc8",
    measurementId: "G-6T8CCCSGVV"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { app, database, storage, auth };



