import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, deleteUser } from "firebase/auth";
import FirebaseConfig from "./FirebaseConfig";
import { router } from "expo-router";
import Toast from 'react-native-toast-message';

const { auth } = FirebaseConfig; 

export const createUser = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      console.log('User account created & signed in!', userCredential.user);
      return userCredential;
    })
    .catch((error) => {
      let message = 'Noget gik galt.';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Den emailadresse er allerede i brug!';
      } else if (error.code === 'auth/invalid-email') {
        message = 'Den angivne emailadresse er ugyldig!';
      } else if (error.code === 'auth/weak-password') {
        message = 'Adgangskoden skal være over 6 tegn';
      }

      // Show the toast message for weak password or other errors
      Toast.show({
        type: 'error',
        text1: 'Oprettelse mislykkedes',
        text2: message,
        visibilityTime: 5000,
        position: 'top',
      });

      throw new Error(message); // Reject the promise to stop further actions
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

export const updatePassword = (newPassword) => {
  const user = auth.currentUser; // Get the currently authenticated user
  if (!user) {
      Toast.show({
        type: 'error',
        text1: 'Opdatering mislykkedes',
        text2: 'Brugeren er ikke godkendt',  
        visibilityTime: 5000,
        position: 'top',
      });
      return Promise.reject("User is not authenticated");
  }

  // Update the password for the currently authenticated user
  return updatePassword(user, newPassword)
      .then(() => {
          // Password updated successfully
          Toast.show({
            type: 'success',
            text1: 'Password opdateret',
            text2: 'Dit password er opdateret',  
            visibilityTime: 5000,
            position: 'top',
          });
      })
      .catch((error) => {
          // Handle errors (e.g., user is not signed in or other issues)
          console.error("Error updating password:", error.message);
          Toast.show({
            type: 'error',
            text1: 'Opdatering mislykkedes',
            text2: error.message,  
            visibilityTime: 5000,
            position: 'top',
          });
          throw error;
      });
}

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