import {
  doc,
  collection,
  setDoc,
  getDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import moment from "moment";
import FirebaseConfig from "../../firebase/FirebaseConfig"; // Import the default config

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addBowelLog = async (  userId,  bowelType,  pain,  blood,  urgent,  notes) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Get the current local date and time
    const localDate = new Date();

    // Format the date to 'YYYY-MM-DD' (ISO format)
    const date = localDate.toISOString().split("T")[0]; // YYYY-MM-DD

    // Format the time to 'HH:MM:SS' (local time format)
    const time = localDate
      .toLocaleTimeString("en-GB", { hour12: false })
      .split(":")
      .join(":");
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
      timestamp: new Date().toISOString(), // Include timestamp for the log entry
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

//Used in home.js for displaying the bowel logs
export const fetchBowelLog = async (userId, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Correctly reference the subcollection
    const bowelRef = collection(
      firestore,
      `users/${userId}/bowelLogs/${date}/timeLogs`
    );
    const q = query(bowelRef); // Optionally add query filters here, e.g., where clauses
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const bowelLogs = snapshot.docs.map((doc) => ({
        id: doc.id, // Add the document ID to each bowel log entry
        ...doc.data(), // Spread the rest of the document data
      }));
      return bowelLogs; // Return an array of bowel log entries with unique IDs
    } else {
      console.log("No bowel log found for this date.");
      return null; // No bowel log found for the given date
    }
  } catch (error) {
    console.error("Error fetching bowel log:", error);
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

    // Loop through each day of the week
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
        total: total || 0, // Default to 0 if no logs for the day
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

    // Reference to the `bowelLogs` collection
    const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs`);

    // Loop through each day of the week
    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");

      // Reference to the 'timeLogs' sub-collection for the current date
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

export const averageBowelLogs = async (userId, selectedDate) => {
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

    const bowelLogsRef = collection(firestore, `users/${userId}/bowelLogs`);
    let totalBowelLogs = 0;

    // Loop through each day of the week
    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");

      // Reference to the 'timeLogs' sub-collection for the current date
      const dateDocRef = doc(bowelLogsRef, date);
      const timeLogsRef = collection(dateDocRef, "timeLogs");

      // Query the timeLogs sub-collection
      const querySnapshot = await getDocs(timeLogsRef);

      // Count the bowel logs for the day
      totalBowelLogs += querySnapshot.docs.length; // Increment the total by the number of logs for the day
    }

    // Calculate the average bowel logs for the week (divide by 7)
    const averageLogs = totalBowelLogs / 7;

    const formattedAverage = averageLogs.toFixed(2); // Format the average to 2 decimal places

    return parseFloat(formattedAverage);;
  } catch (error) {
    console.error("Error fetching average bowel logs:", error);
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
