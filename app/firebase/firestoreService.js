import { doc, setDoc } from "firebase/firestore"; // Modular Firestore imports
import firebaseConfig from "./FirebaseConfig";

const { db } = firebaseConfig; // Get Firestore instance

export const addUserToFirestore = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid); // Use doc() to reference the document
    await setDoc(userRef, userData); // Use setDoc to write data
    console.log("User added to Firestore:", userData);
  } catch (error) {
    console.error("Error adding user to Firestore:", error.message);
    throw error;
  }
};
