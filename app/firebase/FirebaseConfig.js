// FirebaseConfig.js (change to default export)
import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCmqFKQpGcT5AWkN2283cfuJwH7DF9sKuo",
  authDomain: "ibs-kompas.firebaseapp.com",
  projectId: "ibs-kompas",
  storageBucket: "ibs-kompas.firebasestorage.app",
  messagingSenderId: "927934661502",
  appId: "1:927934661502:web:4e5b32cff792d655c6a92f",
  measurementId: "G-V7WEYF58WY"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
auth.setPersistence(getReactNativePersistence(AsyncStorage));
const db = getFirestore(app);
const storage = getStorage(app);

// Export as default object
export default { app, auth, db, storage };
