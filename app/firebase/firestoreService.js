import { firestore } from "./FirebaseConfig";

export const addUserToFirestore = async (uid, userData) => {
  try {
    await firestore.collection("users").doc(uid).set(userData);
    console.log("User added to Firestore:", userData);
  } catch (error) {
    console.error("Error adding user to Firestore:", error.message);
    throw error;
  }
};


