import { signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { auth } from "./FirebaseConfig"; 
import { router } from "expo-router";

export const signInUser = (email, password) => {
    if (!email || !password) {
        Toast.show({
          type: 'error',
          text1: 'Login mislykkedes',
          text2: 'Indtast både email og password',  
          visibilityTime: 5000,
          position: 'top',
        });
        return Promise.reject("Email or password missing");
      }
    
      // Call Firebase signInWithEmailAndPassword directly
      return signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Login successful, return userCredential
          return userCredential;
        })
        .catch((error) => {
          // Handle Firebase errors and show toast notification
          Toast.show({
            type: 'error',
            text1: 'Login mislykkedes',
            text2: 'Brugeren eksisterer ikke',  
            visibilityTime: 5000,
            position: 'top',
          });
          throw error; // Reject to propagate the error
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

export const resetPassword = (email) => {
  if (!email) {
      Toast.show({
        type: 'error',
        text1: 'nulstilling mislykkedes',
        text2: 'Indtast en email for at nulstille adgangskoden',  
        visibilityTime: 5000,
        position: 'top',
      });
      return Promise.reject("Email is missing");
  }

  return sendPasswordResetEmail(auth, email)
      .then(() => {
          Toast.show({
            type: 'success',
            text1: 'Email til nulstilling af password afsendt',
            text2: 'Tjek din email for yderligere instruktioner',  
            visibilityTime: 5000,
            position: 'top',
          });
      })
      .catch((error) => {
          console.error("Reset error:", error.message);
          Toast.show({
            type: 'error',
            text1: 'Nulstilling mislykkedes',
            text2: 'Kunne ikke sende email',  
            visibilityTime: 5000,
            position: 'top',
          });
          throw error;
      });
};