import app from 'firebase/app';
import firebase from 'firebase';

const firebaseConfig = {
    apiKey: "AIzaSyBTRMrpHKA5v0YQuqGV363OIGnYkdQk6UQ",
    authDomain: "proyectoreactnativep3.firebaseapp.com",
    projectId: "proyectoreactnativep3",
    storageBucket: "proyectoreactnativep3.appspot.com",
    messagingSenderId: "612249457249",
    appId: "1:612249457249:web:46f22a664f16e1fe585020"
};

app.initializeApp(firebaseConfig);

export const auth = firebase.auth();
export const storage = app.storage();
export const db = app.firestore();