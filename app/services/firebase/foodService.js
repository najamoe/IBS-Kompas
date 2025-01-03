import {
  collection,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  deleteDoc,
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
    });

    console.log(`Successfully added food to ${type} log.`);
  } catch (error) {
    console.error("Error adding food intake:", error);
  }
};

//Fecthing food based on type of meal
export const fetchFoodIntake = async (userId, date, type) => {
  try {
    if (!firestore || !userId || !date || !type) {
      throw new Error("Firestore instance, userId, date, or type is missing.");
    }

    const foodLogRef = collection(
      firestore,
      `users/${userId}/foodLogs/${date}/${type}`
    );

    const snapshot = await getDocs(foodLogRef);
    const foodData = [];

    snapshot.forEach((doc) => {
      foodData.push(doc.data());
    });

    return foodData;
  } catch (error) {
    console.error("Error fetching food intake:", error);
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
      const types = ["breakfast", "lunch", "dinner"];
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
  try {
    if (!firestore || !userId || !foodData || !type) {
      throw new Error(
        "Firestore instance, userId, foodData, or type is missing."
      );
    }

    const date = moment().format("YYYY-MM-DD");
    const foodLogRef = collection(
      firestore,
      `users/${userId}/foodLogs/${date}/${type}`
    );

    // Query for the document by its name or other unique identifier
    const q = query(foodLogRef, where("name", "==", foodData.name));

    const snapshot = await getDocs(q);
    snapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

   
  } catch (error) {
    console.error("Error deleting food intake:", error);
  }
};
