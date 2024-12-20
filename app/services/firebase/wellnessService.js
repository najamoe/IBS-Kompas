import { doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; 
import moment from "moment";

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addWellnessLog = async (userId, emoticonType) => {
  try {
    if (!firestore || !userId || !emoticonType) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
    const wellnessLogsRef = collection(firestore, `users/${userId}/wellnessLogs`);
    const logRef = doc(wellnessLogsRef, date);

    // Check if today's log exists
    const logDoc = await getDoc(logRef);

    if (logDoc.exists()) {
      // If a log exists for today, update the emoticonType
      await updateDoc(logRef, {
        emoticonType: emoticonType,
        updatedAt: new Date(), // Optional: Track when the log was updated
      });
    } else {
      // If no log exists for today, create a new one
      const logData = {
        timestamp: new Date(),
        emoticonType: emoticonType,
      };

      await setDoc(logRef, logData);
    }
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

export const fetchWeeklyWellnessLog = async (userId, weekStartDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Get the start and end date for the week (Monday-Sunday)
    const startOfWeek = moment(weekStartDate).startOf("isoWeek").format("YYYY-MM-DD"); // Start of the week (Monday)
    const endOfWeek = moment(weekStartDate).endOf("isoWeek").format("YYYY-MM-DD");   // End of the week (Sunday)

    const dailyMood = []; // Initialize an array to hold daily moods
    const wellnessLogsRef = collection(firestore, `users/${userId}/wellnessLogs`);

    // Loop over all days of the week to fetch wellness log for each day
    for (let currentDate = moment(startOfWeek); currentDate.isBefore(moment(endOfWeek).add(1, 'days')); currentDate.add(1, 'days')) {
      const date = currentDate.format("YYYY-MM-DD");
      const wellnessLog = doc(wellnessLogsRef, date);
      const snapshot = await getDoc(wellnessLog);

      dailyMood.push({
        date, // Include the date
        emoticonType: snapshot.exists() ? snapshot.data().emoticonType || 0 : 0, // Get the emoticon type for the day
      });
    }

    return dailyMood; // Return the array of daily wellness logs with dates and emoticon types
  } catch (error) {
    console.error("Error fetching weekly wellness logs:", error);
    throw error;
  }
};


