import { doc, collection, setDoc, getDoc, onSnapshot } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; 
import moment from "moment";

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addWaterIntake = async (userId, amount) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const date = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
    const waterLogsRef = collection(firestore, `users/${userId}/waterlogs`); // Use firestore instance
    const waterRef = doc(waterLogsRef, date);

    await setDoc(waterRef, { total: amount }, { merge: true });

  } catch (error) {
    console.error("Error saving water intake:", error);
    throw error;
  }
};

export const subscribeToWeeklyWaterIntake = (
  userId,
  selectedDate,
  callback
) => {
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

    const waterLogsRef = collection(firestore, `users/${userId}/waterlogs`);

    const unsubscribe = onSnapshot(waterLogsRef, (snapshot) => {
      const dailyWaterIntakes = [];

      // Loop through the documents in the collection
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const date = doc.id; // Firestore doc ID is used as the date

        if (date >= startOfWeek && date <= endOfWeek) {
          dailyWaterIntakes.push({
            date,
            total: data.total || 0,
          });
        }
      });

      // Fill missing days of the week with zeros
      for (
        let currentDate = moment(startOfWeek);
        currentDate.isBefore(moment(endOfWeek).add(1, "days"));
        currentDate.add(1, "days")
      ) {
        const date = currentDate.format("YYYY-MM-DD");
        if (!dailyWaterIntakes.find((day) => day.date === date)) {
          dailyWaterIntakes.push({ date, total: 0 });
        }
      }

      // Sort the array by date
      dailyWaterIntakes.sort((a, b) => moment(a.date).diff(moment(b.date)));

      // Trigger the callback with the updated data
      callback(dailyWaterIntakes);
    });

    return unsubscribe; // Return the unsubscribe function to stop listening
  } catch (error) {
    console.error("Error subscribing to weekly water intake:", error);
    throw error;
  }
};

//For the chart
export const fetchWeeklyWaterIntake = async (userId, selectedDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Get the start and end date for the week (Monday-Sunday)
    const startOfWeek = moment(selectedDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD"); // Start of the week (Monday)
    const endOfWeek = moment(selectedDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");   // End of the week (Sunday)

    const dailyWaterIntakes = []; // Initialize an array to hold daily intakes
    const waterLogsRef = collection(firestore, `users/${userId}/waterlogs`);

    // Loop over all days of the week to fetch water intake for each day
    for (let currentDate = moment(startOfWeek); currentDate.isBefore(moment(endOfWeek).add(1, 'days')); currentDate.add(1, 'days')) {
      const date = currentDate.format("YYYY-MM-DD");
      const waterRef = doc(waterLogsRef, date);
      const snapshot = await getDoc(waterRef);

      dailyWaterIntakes.push({
        date, // Include the date
        total: snapshot.exists() ? snapshot.data().total || 0 : 0, // Include the total
      });
    }

    return dailyWaterIntakes; // Return the array of daily water intakes with dates
  } catch (error) {
    console.error("Error fetching weekly water intake:", error);
    throw error;
  }
};

export const removeWaterIntake = async (userId, date, amount) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const waterRef = doc(firestore, `users/${userId}/waterlogs/${date}`); // Use firestore instance
    const snapshot = await getDoc(waterRef);

    if (snapshot.exists()) {
      const currentIntake = snapshot.data().total || 0;
      const newWaterIntake = currentIntake - amount;

      // Update the water intake value in Firestore
      await setDoc(waterRef, { total: newWaterIntake }, { merge: true });

      return newWaterIntake; // Return the updated intake value
    } else {
      return 0;
    }
  } catch (error) {
    console.error("Error removing water from daily log:", error);
    throw error;
  }
};
