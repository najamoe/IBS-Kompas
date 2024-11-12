import { signInWithEmailAndPassword } from "firebase/auth";
import { Alert } from "react-native";
import { auth } from "./FirebaseConfig";  // adjust if needed

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
