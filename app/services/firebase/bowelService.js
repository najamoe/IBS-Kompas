import {
  doc,
  collection,
  setDoc,
  getDoc,
  query,
  getDocs,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import moment from "moment-timezone";
import FirebaseConfig from "../../firebase/FirebaseConfig";

const firestore = FirebaseConfig.db; // Accessing Firestore instance

export const addBowelLog = async (
  userId,
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
    
    // Format the date to 'YYYY-MM-DD'
    const date = moment().format("YYYY-MM-DD");
    const time = moment().tz("Europe/Copenhagen").format("HH:mm:ss");

    // Reference to the bowelLogs collection under the user
    const bowelLogsRef = collection(
      firestore,
      `users/${userId}/bowelLogs/${date}/timeLogs`
    ); // Reference to the bowelLogs subcollection

    // Create a bowel log entry object with all fields
    const bowelLog = {
      bowelType,
      pain,
      blood,
      urgent,
      notes,
      timestamp: time, // Include timestamp for the log entry
    };

    // Use a document reference with date as the ID
    const bowelRef = doc(bowelLogsRef, time);

    // Save the bowel log in Firestore
    await setDoc(bowelRef, bowelLog);
  } catch (error) {
    console.error("Error saving bowel log from addBowelLog:", error);
    throw error;
  }
};

// Real-time subscription for bowel logs
export const subscribeBowelLog = (userId, date, callback) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }
    // Referencing the collection
    const bowelRef = collection(
      firestore,
      `users/${userId}/bowelLogs/${date}/timeLogs`
    );

    // Creating a query to get all documents in the collection
    const q = query(bowelRef);

    // Using onSnapshot to listen for changes in real time
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Map through the snapshot.docs array
        const bowelLogs = snapshot.docs.map((doc) => {
          return {
            id: doc.id, // Extract the document ID
            ...doc.data(), // Spread the rest of the document data
          };
        });

        callback(bowelLogs); // Pass the updated logs to the callback
      } else {
        callback(null); 
      }
    });

    // Return the unsubscribe function to stop the listener when needed
    return unsubscribe;
  } catch (error) {
    console.error("Error subscribing to bowel log:", error);
    throw error;
  }
};

export const fetchWeeklyBowelLogByFrequency = async (userId, selectedDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Get the start and end date for the week (Monday-Sunday)
    const startOfWeek = moment(selectedDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfWeek = moment(selectedDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    const dailyBowelLog = [];
    const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs`);

    // Looping through each day of the week
    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");

      // Query the timestamp subcollection for the current date
      const dateDocRef = doc(bowelLogsRef, date); // Create document reference for each date
      const timestampRef = collection(dateDocRef, "timeLogs"); // Query the 'timeLogs' subcollection
      const querySnapshot = await getDocs(timestampRef);

      // Calculate the total for the day (e.g., count the number of logs for the day)
      const total = querySnapshot.docs.length; // Count the number of logs for the day

      // Push the daily log with the total
      dailyBowelLog.push({
        date,
        total: total || 0, // Default to 0 if no logs for the day (so the chart dosent get error)
      });
    }

    return dailyBowelLog; // Return an array of bowel logs for the week
  } catch (error) {
    console.error("Error fetching weekly bowel log:", error);
    throw error;
  }
};

export const fetchWeeklyBowelLogByType = async (userId, selectedDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Calculate start and end date for the week (Monday-Sunday)
    const startOfWeek = moment(selectedDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfWeek = moment(selectedDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    const bowelTypeCount = {};

    // Referencing the collection
    const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs`);

    // Looping through each day of the week
    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");

      // Referencing the 'timeLogs' sub-collection for the current date
      const dateDocRef = doc(bowelLogsRef, date);
      const timeLogsRef = collection(dateDocRef, "timeLogs");

      // Query the timeLogs sub-collection
      const querySnapshot = await getDocs(timeLogsRef);

      // Process the fetched bowel logs
      querySnapshot.docs.forEach((doc) => {
        const bowelType = doc.data().bowelType;
        bowelTypeCount[bowelType] = (bowelTypeCount[bowelType] || 0) + 1;
      });
    }

    if (Object.keys(bowelTypeCount).length === 0) {
      console.log("No bowel log found for this week.");
      return null;
    }

    // Find the most frequent bowel type
    const mostFrequentType = Object.keys(bowelTypeCount).reduce((a, b) =>
      bowelTypeCount[a] > bowelTypeCount[b] ? a : b
    );

    return { mostFrequentType, bowelTypeCount };
  } catch (error) {
    console.error(
      "Error fetching bowel log by type from bowelService.js:",
      error
    );
    throw error;
  }
};

export const fetchBowelLogDetails = async (userId, selectedDate, logType) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const startOfWeek = moment(selectedDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfWeek = moment(selectedDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs`);
    let totalLogs = 0;
    let totalEntries = 0;

    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");
      const dateDocRef = doc(bowelLogsRef, date);
      const timeLogsRef = collection(dateDocRef, "timeLogs");
      const querySnapshot = await getDocs(timeLogsRef);

      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();

        switch (logType) {
          case "averageBowelLogs":
            // Increment by the number of logs
            totalLogs += 1;
            break;

          case "bloodLogs":
            // Count logs where `blood` is true
            if (data.blood) {
              totalLogs += 1;
            }
            break;

          case "painLogs":
            // Sum pain values
            const painValue = Number(data.pain) || 0;
            totalLogs += painValue;
            totalEntries += 1;
            break;

          case "urgentLogs":
            // Count logs where `urgent` is true
            if (data.urgent) {
              totalLogs += 1;
            }
            break;

          default:
            throw new Error(`Unknown log type: ${logType}`);
        }
      });
    }

    if (logType === "painLogs") {
      // Return the average pain per entry
      const averagePain = totalLogs / totalEntries || 0;
      return parseFloat(averagePain.toFixed(2));
    }

    // Return the average for the week (divide by 7 days)
    const averageLogs = totalLogs / 7 || 0;
    return parseFloat(averageLogs.toFixed(2));
  } catch (error) {
    console.error(`Error fetching ${logType}:`, error);
    throw error;
  }
};

// Function to delete all bowel logs for a specific timestamp
export const deleteBowelLog = async (userId, time) => {
  try {
    if (!firestore || !userId || !time) {
      throw new Error("Firestore instance, userId, or time is missing.");
    }

    const localDate = new Date();
    const date = localDate.toISOString().split("T")[0]; 
    
    const bowelLogsRef = collection(
      firestore,
      `users/${userId}/bowelLogs/${date}/timeLogs`
    );

    const bowelRef = doc(bowelLogsRef, time);

    // Check if the document exists before deleting
    const docSnapshot = await getDoc(bowelRef);
    if (docSnapshot.exists()) {
      await deleteDoc(bowelRef);
    } else {
      console.log("Bowel log not found at the specified time.");
    }
  } catch (error) {
    console.error("Error deleting bowel log:", error);
    throw error;
  }
};
