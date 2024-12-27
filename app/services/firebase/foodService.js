import { collection, addDoc } from "firebase/firestore";
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

    // Reference to the user's food log for the specific type
    const foodLogRef = collection(
      firestore,
      `users/${userId}/foodLog/${date}/${type}`
    );

    // Add food data to the collection
    await addDoc(foodLogRef, {
      ...foodData,
      type,
      date,
      timestamp: foodData.timestamp || moment().toISOString(), // Ensure timestamp exists
    });

    console.log(`Successfully added food to ${type} log.`);
  } catch (error) {
    console.error("Error adding food intake:", error);
  }
};

export const fetchFoodIntake = async (userId, date, type) => {

  try {
    if (!firestore || !userId || !date || !type) {
      throw new Error("Firestore instance, userId, date, or type is missing.");
    }

    // Reference to the user's food log for the specific type
    const foodLogRef = collection(firestore, `users/${userId}/foodLog/${date}/${type}`);

    // Fetch food data from the collection
    const snapshot = await getDocs(foodLogRef);
    const foodData = snapshot.docs.map((doc) => doc.data());

    console.log(`Successfully fetched ${type} log for ${date}.`);

    return foodData;
  } catch (error) {
    console.error("Error fetching food intake:", error);
  }
};

export default addFoodIntake;
