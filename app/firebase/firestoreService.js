import { doc, setDoc, getDoc, updateDoc, collection } from "firebase/firestore"; // Modular Firestore imports
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

export const updateUserDetails = async (uid, updates) => {
  try {
    const userRef = doc(db, "users", uid); 
    await updateDoc(userRef, updates); // Update the document with the provided data
    console.log("User details updated:", updates);
  } catch (error) {
    console.error("Error updating user details:", error.message);
    throw error;
  }
};

// Function to add a daily log
export const addDailyLog = async (uid, logData) => {
  try {
    // Get the current date in YYYY-MM-DD format
    const currentDate = new Date().toISOString().split('T')[0]; // e.g., '2024-12-02'

    // Reference to the user's 'dailylogs' subcollection
    const logRef = doc(
      collection(db, "users", uid, "dailylogs"), // Reference to the 'dailylogs' subcollection
      currentDate // Use the current date as the document ID
    );

    // Set the daily log data to Firestore
    await setDoc(logRef, logData, { merge: true }); // Merge to update if the document already exists

    console.log("Daily log added successfully!");
  } catch (error) {
    console.error("Error adding daily log: ", error.message);
    throw error;
  }
};
