// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'; 

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmqFKQpGcT5AWkN2283cfuJwH7DF9sKuo",
  authDomain: "ibs-kompas.firebaseapp.com",
  projectId: "ibs-kompas",
  storageBucket: "ibs-kompas.firebasestorage.app",
  messagingSenderId: "927934661502",
  appId: "1:927934661502:web:4e5b32cff792d655c6a92f",
  measurementId: "G-V7WEYF58WY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)  
});


export {app, auth}