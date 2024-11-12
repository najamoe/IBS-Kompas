import { signInWithEmailAndPassword } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { auth } from "./FirebaseConfig"; 
import { router } from "expo-router";

export const signInUser = (email, password) => {
  return new Promise((resolve, reject) => {
    if (!email || !password) {
      reject("Please enter both email and password.");
    }

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        resolve(userCredential);
      })
      .catch((error) => {
        reject(error.message);
      });
  });
};

export const signOutUser = () => {
    auth.signOut()
    .then(() => {
      router.replace('/');  
      Toast.show({
        type: 'success',
        text1: 'Logget ud',
        text2: 'Du er nu logget ud af din konto',
        visibilityTime: 5000,  
        position: 'top',  
      });
    })
    .catch((error) => {
      console.error("Sign out error:", error.message);
    });
};
