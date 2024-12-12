import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; 

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addWellnessLog = async (userId) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const wellnessLogsRef = collection(firestore, `users/${userId}/wellnessLogs`); // Use firestore instance
    const logRef = doc(wellnessLogsRef, date);

    // Check if today's log exists
    const logDoc = await getDoc(logRef);
    if (logDoc.exists()) {
      console.log("Wellness log already exists for today.");
      return; // Optional: Handle updates if needed
    }

    // Create a new log entry
    const logData = {
      timestamp: new Date(),
      action: "Wellness activity added", 
    };

    await setDoc(logRef, logData);

    console.log("Wellness log added successfully!");
  } catch (error) {
    console.error("Error adding wellness log:", error.message);
    throw error;
  }
};
