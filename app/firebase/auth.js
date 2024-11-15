import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import Toast from 'react-native-toast-message';
import { auth } from "./FirebaseConfig"; 
import { router } from "expo-router";

export const createUser = (email, password) => {
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log("User created successfully:", user);
      // You can also redirect the user or show a success message here
      Toast.show({
        type: 'success',
        text1: 'Account Created',
        text2: 'Your account has been created successfully!',
        visibilityTime: 5000,
        position: 'top',
      });
      // Optionally, redirect the user or handle further actions here
      // For example:
      // router.push('/dashboard'); // redirect after successful sign-up
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      
      console.error("Create user error:", errorMessage);

      let errorText = 'Kunne ikke oprette bruger'; // Default error message

      if (errorCode === 'auth/email-already-in-use') {
        errorText = 'Email already in use';
      } else if (errorCode === 'auth/weak-password') {
        errorText = 'Password is too weak';
      }

      Toast.show({
        type: 'error',
        text1: 'Oprettelse mislykkedes',
        text2: errorText,
        visibilityTime: 5000,
        position: 'top',
      });
    });
};

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

export const deleteUserAccount = () => {
  const user = auth.currentUser; // Get the currently authenticated user
  if (!user) {
      Toast.show({
          type: 'error',
          text1: 'Deletion failed',
          text2: 'User is not authenticated',
          visibilityTime: 5000,
          position: 'top',
      });
      return Promise.reject("User is not authenticated");
  }

  // Delete the user account from Firebase Authentication
  return deleteUser(user)
      .then(() => {
        console.log("User deleted successfully");
          // Account deletion successful
          Toast.show({
              type: 'success',
              text1: 'Konto slettet',
              text2: 'Din konto er slettet',
              visibilityTime: 5000,
              position: 'top',
          });

          // redirect user after deletion
          router.replace('/');  
      })
      .catch((error) => {
          // Handle errors (e.g., user is not signed in or other issues)
          console.error("Error deleting account:", error.message);
          Toast.show({
              type: 'error',
              text1: 'Account deletion failed',
              text2: error.message,
              visibilityTime: 5000,
              position: 'top',
          });
          throw error;
      });
}