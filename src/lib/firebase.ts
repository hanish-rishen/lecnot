import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBCFXFASYaBibg7ZiFIYlD1W25Bpke4voc",
    authDomain: "lecnot-87789.firebaseapp.com",
    projectId: "lecnot-87789",
    storageBucket: "lecnot-87789.appspot.com",
    messagingSenderId: "462580519658",
    appId: "1:462580519658:web:7e6031698b083418a77d93",
    measurementId: "G-X0BR5Q67P5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);