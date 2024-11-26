import { doc, setDoc, getDoc } from "firebase/firestore"; // Modular Firestore imports
import { getAuth } from "firebase/auth";
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

export const fetchUserDetails = async (uid) => {
  const userRef = doc(db, "users", uid); // Ensure the collection name is correct
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

export const addDetailsToUser = async (uid, ) => {



};
