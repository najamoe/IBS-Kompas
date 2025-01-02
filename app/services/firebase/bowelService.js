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

export const fetchWeeklyBowelLogByFrequency = async (userId, weekStartDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Get the start and end date for the week (Monday-Sunday)
    const startOfWeek = moment(weekStartDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfWeek = moment(weekStartDate)
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

      console.log(
        `Logs for date: ${date}`,
        querySnapshot.docs.map((doc) => doc.data())
      );

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








export const fetchWeeklyBowelLogByType = async (userId, date, type) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Get the start and end date for the week (Monday-Sunday)
    const startOfWeek = moment(weekStartDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD"); // Start of the week (Monday)
    const endOfWeek = moment(weekStartDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD"); // End of the week (Sunday)
    const bowelRef = collection(
      firestore,
      `users/${userId}/bowelLogs/${date}/timeLogs`
    );
    const q = query(bowelRef, where("bowelType", "==", type)); // Filter by bowel type
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
    console.error("Error fetching bowel log by type:", error);
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
