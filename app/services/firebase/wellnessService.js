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
//Used in home.js 
export const fetchWellnessLog = async (userId, date) => {
  try {
      if (!firestore || !userId) {
          throw new Error("Fire store instance or userId is missing");
      }

      const logRef = doc(firestore, `users/${userId}/wellnessLogs/${date}`);
      const snapshot = await getDoc(logRef);

      if (snapshot.exists()) {
          return snapshot.data().emoticonType;
      } else {
          console.log("No wellnesslog found for the given date, returning 0");
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
    const startOfWeek = moment(weekStartDate).startOf("isoWeek").format("YYYY-MM-DD");
    const endOfWeek = moment(weekStartDate).endOf("isoWeek").format("YYYY-MM-DD");

    const dailyMood = []; // Initialize an array to hold daily moods
    const wellnessLogsRef = collection(firestore,
      `users/${userId}/wellnessLogs`
    );

    // Loop over all days of the week to fetch wellness log for each day
    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");
      const wellnessLog = doc(wellnessLogsRef, date);
      const snapshot = await getDoc(wellnessLog);

      const emoticonType = snapshot.exists()
        ? snapshot.data().emoticonType || null
        : null;

      // Only push valid emoticon types (exclude '0' or any empty value)
      if (emoticonType && emoticonType !== "0") {
        dailyMood.push({
          date, // Include the date
          emoticonType, // Get the emoticon type for the day
        });
        console.log("Fetched emoticonType for", date, ":", emoticonType);
      } else {
        console.log("No valid emoticonType for", date);
      }
    }

    // If no valid emoticon types were found, return a default value or handle appropriately
    if (dailyMood.length === 0) {
   
      return null; // or you could return a default value or handle it differently
    }

    // Count occurrences of each emoticon type
    const emoticonCounts = dailyMood.reduce((acc, { emoticonType }) => {
      acc[emoticonType] = (acc[emoticonType] || 0) + 1;
      return acc;
    }, {});

    // Find the maximum count value
    const maxCount = Math.max(...Object.values(emoticonCounts));

    // Find all emoticons with the maximum count
    const mostFrequentEmoticons = Object.keys(emoticonCounts).filter(
      (key) => emoticonCounts[key] === maxCount
    );

    // Handle the case where there is a tie with exactly two emoticons
    if (mostFrequentEmoticons.length >= 2 ) {
     
      return {
        message: "Der står lige imellem",
        emoticons: mostFrequentEmoticons,
      };
    }

    // If no tie, return the most frequent emoticon
    const mostFrequentEmoticon = mostFrequentEmoticons[0];
  
    return mostFrequentEmoticon; // Return the most frequent emoticon type
  } catch (error) {
    console.error("Error fetching weekly wellness logs:", error);
    throw error;
  }
};





