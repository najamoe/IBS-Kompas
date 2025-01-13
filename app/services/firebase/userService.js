import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // Modular Firestore imports
import firebaseConfig from "../../firebase/FirebaseConfig";

const { db } = firebaseConfig; // Get Firestore instance

export const addUserToFirestore = async (uid, userData) => {
  try {
    const userRef = doc(db, "users", uid); 
    await setDoc(userRef, userData); 
  } catch (error) {
    console.error("Error adding user to Firestore:", error.message);
    throw error;
  }
};

export const fetchUserDetails = async (uid) => {
  const userRef = doc(db, "users", uid); 
  const userSnap = await getDoc(userRef);

  if (userSnap.exists()) {
    return userSnap.data();
  } else {
    console.log("No such document!");
    return null;
  }
};

export const updateUserDetails = async (uid, updates) => {
  try {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, updates); 
  } catch (error) {
    console.error("Error updating user details:", error.message);
    throw error;
  }
};
