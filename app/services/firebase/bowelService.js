import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; // Import the default config

const firestore = FirebaseConfig.db; // Access the Firestore instance


export const addBowelLog = async (userId, bowelType, pain, blood, urgent, notes, ) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const time = new Date().toISOString().split("T")[1].split(".")[0]; 
       // Reference to the bowelLogs collection under the user
       const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs/${date}/timeLogs`);// Reference to the bowelLogs subcollection

    // Create a bowel log entry object with all fields
    const bowelLog = {
      bowelType,
      pain,
      blood,
      urgent,
      notes,
      timestamp: new Date().toISOString(), // Include timestamp for the log entry
    };

    // Use a document reference with date as the ID
    const bowelRef = doc(bowelLogsRef, time);   

    // Save the bowel log in Firestore
    await setDoc(bowelRef, bowelLog);

    console.log("Bowel log saved:", bowelLog);
  } catch (error) {
    console.error("Error saving bowel log from addBowelLog:", error);
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
      return snapshot.data(); // Return all the data from the log
    } else {
      console.log("No bowel log found for this date.");
      return null; // No bowel log found for the given date
    }
  } catch (error) {
    console.error("Error fetching bowel log:", error);
    throw error;
  }
};

export const editBowelLog = async (
  userId,
  date,
  bowelType,
  pain,
  blood,
  urgent,
  notes
) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const bowelRef = doc(firestore, `users/${userId}/bowelLogs/${date}`);
    const snapshot = await getDoc(bowelRef);

    if (snapshot.exists()) {
      // Update the bowel log with the new values
      const updatedLog = {
        bowelType,
        pain,
        blood,
        urgent,
        notes,
        timestamp: new Date().toISOString(), // Update the timestamp as well
      };

      await setDoc(bowelRef, updatedLog, { merge: true });

      console.log("Bowel log updated:", updatedLog);
      return updatedLog; // Return the updated log object
    } else {
      console.log("No bowel log found for this date.");
      return null;
    }
  } catch (error) {
    console.error("Error updating bowel log:", error);
    throw error;
  }
};

export const removeBowelLog = async (userId, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const bowelRef = doc(firestore, `users/${userId}/bowelLogs/${date}`);
    const snapshot = await getDoc(bowelRef);

    if (snapshot.exists()) {
      // Remove the bowel log document
      await setDoc(bowelRef, {}, { merge: true }); // Clears the document content

      console.log("Bowel log removed for date:", date);
      return null; // Return null to indicate removal
    } else {
      console.log("No bowel log found for this date.");
      return null;
    }
  } catch (error) {
    console.error("Error removing bowel log:", error);
    throw error;
  }
};

