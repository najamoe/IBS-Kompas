import {
  getAuth,
  EmailAuthProvider,
  reauthenticateWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import FirebaseConfig from "./FirebaseConfig";
import { router } from "expo-router";
import { Alert } from "react-native";

const { auth } = FirebaseConfig;

export const reauthenticateUser = async (user, currentPassword) => {
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  const auth = getAuth();
  const credential = EmailAuthProvider.credential(user.email, currentPassword);

  try {
    await reauthenticateWithCredential(user, credential);
    console.log("User reauthenticated successfully.");
  } catch (error) {
    console.error("Error reauthenticating:", error.message);
    throw new Error(
      "Reauthentication failed. Please check your current password."
    );
  }
};

export const createUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return userCredential;
  } catch (error) {
    throw error;
  }
};

export const signInUser = async (email, password) => {
  if (!email || !password) {
    return Promise.reject("Email or password missing");
  }

  // Call Firebase signInWithEmailAndPassword directly
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email.trim(),
      password
    );
    return userCredential;
  } catch (error) {
    // Handle Firebase errors and show notification
    console.error("Sign in error:", error.message);
    throw error; // Reject to propagate the error
  }
};

export const signOutUser = () => {
  auth
    .signOut()
    .then(() => {
      router.replace("/");
    })
    .catch((error) => {
      console.error("Sign out error:", error.message);
    });
};

export const resetPassword = async (email) => {
  if (!email) {
    return Promise.reject("Email is missing");
  }

  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error) {
    console.error("Reset error:", error.message);
    throw error;
  }
};

export const updateUserPassword = async (user, newPassword) => {
  if (
    !newPassword ||
    typeof newPassword !== "string" ||
    newPassword.trim().length === 0
  ) {
    throw new Error("Password must be a non-empty string.");
  }

  const auth = getAuth();
  if (!user) {
    throw new Error("User is not authenticated.");
  }

  try {
    const userCredential = await updatePassword(user, newPassword);
    return userCredential;
  } catch (error) {
    console.error("Firebase error:", error.message);
    throw error;
  }
};

export const deleteUserAccount = async () => {
  const auth = getAuth();
  const user = auth.currentUser;

  // user needs to be authenticated
  if (!user) {
    throw new Error("User is not authenticated");
  }
  try {
    await deleteUser(user); 
   
    router.replace("/");
  } catch (error) {
    console.error("Error deleting account:", error.message);

    throw error;
  }
};
