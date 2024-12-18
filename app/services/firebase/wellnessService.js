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
      console.log("Starting fetchWellnessLog function...");

      if (!firestore || !userId) {
          throw new Error("Fire store instance or userId is missing");
      }

      console.log(`Fetching wellness log for userId: ${userId} on date: ${date}`);

      const logRef = doc(firestore, `users/${userId}/wellnessLogs/${date}`);
      console.log(`Document reference created: users/${userId}/wellnessLogs/${date}`);

      const snapshot = await getDoc(logRef);
      console.log("Snapshot fetched:", snapshot.exists());

      if (snapshot.exists()) {
          console.log("Emoticon type found:", snapshot.data().emoticonType);
          return snapshot.data().emoticonType;
      } else {
          console.log("No log found for the given date, returning 0");
          return 0;
      }
  } catch (error) {
      console.log("Error fetching emoticonType:", error);
      throw error;
  }
};

