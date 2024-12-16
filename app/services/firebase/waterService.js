import { doc, collection, setDoc, getDoc } from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig"; 

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

    console.log("Water intake saved:", amount);
  } catch (error) {
    console.error("Error saving water intake:", error);
    throw error;
  }
};

export const fetchWaterIntake = async (userId, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const waterRef = doc(firestore, `users/${userId}/waterlogs/${date}`); // Use firestore instance
    const snapshot = await getDoc(waterRef);

    if (snapshot.exists()) {
      return snapshot.data().total || 0;
    } else {
      console.log("No water log found for this date.");
      return 0;
    }
  } catch (error) {
    console.error("Error fetching water intake:", error);
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
