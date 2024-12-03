import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; // Import the default config

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addBowelLog = async (userId, type) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs`); 
    const bowelRef = doc(bowelLogsRef, date);

    await setDoc(bowelRef, { total: type }, { merge: true });

    console.log("bowel log saved:", type);
  } catch (error) {
    console.error("Error saving boel log from ADDBOWELLOG:", error);
    throw error;
  }
};

export const fetchBowelLog = async (userId, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const bowelRef = doc(firestore, `users/${userId}/bowelLogs/${date}`); 
    const snapshot = await getDoc(bowelRef);

    if (snapshot.exists()) {
      return snapshot.data().total || 0;
    } else {
      console.log("No bowel log found for this date.");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching bowel log:", error);
    throw error;
  }
};

export const removeBowelLog = async (userId, date, type) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const bowelRef = doc(firestore, `users/${userId}/bowelLogs/${date}`); 
    const snapshot = await getDoc(bowelRef);

    if (snapshot.exists()) {
      const currentBowelLog = snapshot.data().total || 0;
      const newBowelLog = currentBowelLog - type;

      // Update the bowel log in Firestore
      await setDoc(bowelRef, { total: newBowelLog }, { merge: true });

      console.log("bowel log updated:", newBowelLog);
      return newBowelLog; // Return the updated log
    } else {
      console.log("No bowel log found for this date.");
      return 0;
    }
  } catch (error) {
    console.error("Error removing bowel lof from daily log:", error);
    throw error;
  }
};
