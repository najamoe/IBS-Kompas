import { getAuth, EmailAuthProvider, reauthenticateWithCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import FirebaseConfig from "./FirebaseConfig";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

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
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User account created & signed in!", userCredential.user);
    return userCredential;
  } catch (error) {
    let message_1 = "Noget gik galt.";
    if (error.code === "auth/email-already-in-use") {
      message_1 = "Den emailadresse er allerede i brug!";
    } else if (error.code === "auth/invalid-email") {
      message_1 = "Den angivne emailadresse er ugyldig!";
    } else if (error.code === "auth/weak-password") {
      message_1 = "Adgangskoden skal være over 6 tegn";
    }

    // Show the toast message for weak password or other errors
    Toast.show({
      type: "error",
      text1: "Oprettelse mislykkedes",
      text2: message_1,
      visibilityTime: 5000,
      position: "top",
    });

    throw new Error(message_1); // Reject the promise to stop further actions
  }
};

export const signInUser = async (email, password) => {
  if (!email || !password) {
    Toast.show({
      type: "error",
      text1: "Login mislykkedes",
      text2: "Indtast både email og password",
      visibilityTime: 5000,
      position: "top",
    });
    return Promise.reject("Email or password missing");
  }

  // Call Firebase signInWithEmailAndPassword directly
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    // Handle Firebase errors and show toast notification
    Toast.show({
      type: "error",
      text1: "Login mislykkedes",
      text2: "Brugeren eksisterer ikke",
      visibilityTime: 5000,
      position: "top",
    });
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
    Toast.show({
      type: "error",
      text1: "nulstilling mislykkedes",
      text2: "Indtast en email for at nulstille adgangskoden",
      visibilityTime: 5000,
      position: "top",
    });
    return Promise.reject("Email is missing");
  }

  try {
    await sendPasswordResetEmail(auth, email);
    Toast.show({
      type: "success",
      text1: "Email til nulstilling af password afsendt",
      text2: "Tjek din email for yderligere instruktioner",
      visibilityTime: 5000,
      position: "top",
    });
  } catch (error) {
    console.error("Reset error:", error.message);
    Toast.show({
      type: "error",
      text1: "Nulstilling mislykkedes",
      text2: "Kunne ikke sende email",
      visibilityTime: 5000,
      position: "top",
    });
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
  const user = auth.currentUser; // Get the currently authenticated user
  if (!user) {
    Toast.show({
      type: "error",
      text1: "Deletion failed",
      text2: "User is not authenticated",
      visibilityTime: 5000,
      position: "top",
    });
    return Promise.reject("User is not authenticated");
  }

  // Delete the user account from Firebase Authentication
  try {
    await deleteUser(user);
    console.log("User deleted successfully");
    // Account deletion successful
    Toast.show({
      type: "success",
      text1: "Konto slettet",
      text2: "Din konto er slettet",
      visibilityTime: 5000,
      position: "top",
    });

    // redirect user after deletion
    router.replace("/");
  } catch (error) {
    // Handle errors (e.g., user is not signed in or other issues)
    console.error("Error deleting account:", error.message);
    Toast.show({
      type: "error",
      text1: "Account deletion failed",
      text2: error.message,
      visibilityTime: 5000,
      position: "top",
    });
    throw error;
  }
};
