import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; 

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addWellnessLog = async (userId, emoticonType) => {
  try {
    if (!firestore || !userId || !emoticonType) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const wellnessLogsRef = collection(firestore, `users/${userId}/wellnessLogs`); // Use firestore instance
    const logRef = doc(wellnessLogsRef, date);

    // Check if today's log exists
    const logDoc = await getDoc(logRef);
    if (logDoc.exists()) {
      return; // Optional: Handle updates if needed
    }

    // Create a new log entry
    const logData = {
      timestamp: new Date(),
      emoticonType: emoticonType,
    };

    await setDoc(logRef, logData);

  } catch (error) {
    console.error("Error adding wellness log:", error.message);
    throw error;
  }
};

export const fetchWellnessLog = async (userId, date) => {
    try {
        if (!firestore || !userId) {
            throw new Error ("Fire store instance or userId is missing");
        }
        const logRef = doc(firestore, `users/${userId}/wellnessLogs/${date}` );
        const snapshot = await getDoc(logRef);
        
        if(snapshot.exists()) {
            return snapshot.data().emoticonType;
        } else {
            return 0;
        }
    } catch (error) {
        console.log("Error fetching emoticonType:", error);
        throw error;
    }
};
