import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig";
import moment from "moment";

const firestore = FirebaseConfig.db; // Access the Firestore instance

export const addFoodIntake = async (userId, foodData, type) => {
  try {
    if (!firestore || !userId || !foodData || !type) {
      throw new Error(
        "Firestore instance, userId, foodData, or type is missing."
      );
    }

    // Determine the current date
    const date = moment().format("YYYY-MM-DD");

    const time = moment().format("HH:mm:ss");

    // Generate the timestamp to use as the document ID
    const timestamp = time;
    const foodLogRef = doc(
      firestore,
      `users/${userId}/foodLogs/${date}/${type}/${timestamp}`
    ); // Set the document ID to timestamp

    // Set food data to the document with timestamp as the ID
    await setDoc(foodLogRef, {
      ...foodData,
      type,
      date,
      timestamp, // Ensure timestamp exists
      categories:
        foodData.categories && foodData.categories.length > 0
          ? foodData.categories
          : ["ukendt"], // Default to "ukendt" if categories are missing
    });
  } catch (error) {
    console.error("Error adding food intake:", error);
  }
};

export const subscribeFood = async (userId, date, type, callback) => {
  if (!firestore || !userId) {
    throw new Error("Firestore instance is missing.");
  }
  try {
    const foodLogRef = collection(
      firestore,
      `users/${userId}/foodLogs/${date}/${type}`
    );

    // Listen to real-time updates
    const unsubscribe = onSnapshot(foodLogRef, (snapshot) => {
      let updatedFood = []; // Collect the updated food data

      snapshot.forEach((doc) => {
        const foodData = { id: doc.id, ...doc.data() };

        updatedFood.push(foodData);
      });

      // Call the callback with the updated food array
      if (callback) {
        callback(updatedFood);
      }
    });

    return unsubscribe; // Return unsubscribe function for cleanup
  } catch (error) {
    console.error("Error subscribing to food data:", error);
  }
};

export const updateFoodItem = async (
  userId,
  itemId,
  updatedItem,
  type,
  date
) => {
  try {
    console.log("Updated Item:", updatedItem); // Check the structure and data of updatedItem

    if (!firestore) {
      throw new Error("Firestore instance is missing.");
    }
    const foodRef = doc(
      firestore,
      `users/${userId}/foodLogs/${date}/${type}/${itemId}`
    );

    // Update the food item in Firestore
    await updateDoc(foodRef, {
      quantity: updatedItem.quantity,
      unit: updatedItem.unit,
    });
  } catch (error) {
    console.error("Error updating item:", error);
    throw error;
  }
};

export const fetchFoodIntakeForWeek = async (userId, weekStartDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance, userId, or date is missing.");
    }

    const startOfWeek = moment(weekStartDate)
      .startOf("isoWeek")
      .format("YYYY-MM-DD");
    const endOfWeek = moment(weekStartDate)
      .endOf("isoWeek")
      .format("YYYY-MM-DD");

    const foodDataByType = {}; // Object to hold food data categorized by type

    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");

      // Loop through the meal types (e.g., breakfast, lunch, dinner)
      const types = ["breakfast", "lunch", "dinner", "snack"];
      for (const type of types) {
        const foodLogRef = collection(
          firestore,
          `users/${userId}/foodLogs/${date}/${type}`
        );

        const snapshot = await getDocs(foodLogRef);
        const foodData = [];

        snapshot.forEach((doc) => {
          foodData.push(doc.data());
        });

        // Organize food data by date and type
        if (!foodDataByType[date]) {
          foodDataByType[date] = {};
        }
        foodDataByType[date][type] = foodData;
      }
    }

    return foodDataByType;
  } catch (error) {
    console.error("Error fetching food intake for week:", error);
  }
};

export const deleteFoodIntake = async (userId, foodData, type) => {
  if (!firestore) {
    throw new Error("Firestore instance is missing.");
  }
  if (!userId || !foodData?.name || !type) {
    throw new Error(
      "Required parameters (userId, foodData.name, or type) are missing."
    );
  }

  try {
    const date = moment().format("YYYY-MM-DD");
    const foodLogRef = collection(
      firestore,
      `users/${userId}/foodLogs/${date}/${type}`
    );

    // Query for the document by its name
    const q = query(foodLogRef, where("name", "==", foodData.name));
    const snapshot = await getDocs(q);
    console.log("Snapshot fetched:", snapshot); // Log the entire snapshot

    for (const doc of snapshot.docs) {
      await deleteDoc(doc.ref);
    }

    if (snapshot.empty) {
      console.warn("No matching food intake found to delete.");
    }
  } catch (error) {
    console.error("Error deleting food intake:", error);
    throw error;
  }
};
