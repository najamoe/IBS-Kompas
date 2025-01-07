import { doc, collection, setDoc, getDoc, updateDoc } from "firebase/firestore";
import moment from "moment";
import FirebaseConfig from "../../firebase/FirebaseConfig";

const firestore = FirebaseConfig.db;

export const addSymptoms = async (userId, date, symptoms) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Reference to the specific date document in symptomLogs
    const symptomDocRef = doc(firestore, `users/${userId}/symptomLogs/${date}`);

    // Fetch the current symptom logs to check for existing symptoms
    const symptomDoc = await getDoc(symptomDocRef);
    let existingSymptoms = [];

    if (symptomDoc.exists()) {
      // If the document exists, retrieve the existing symptoms
      existingSymptoms = symptomDoc.data().symptoms || [];
    }

    // Prepare the updated symptoms
    const updatedSymptoms = symptoms.map((symptom) => {
      const existingSymptom = existingSymptoms.find(
        (s) => s.symptom === symptom.symptom
      );
      if (existingSymptom) {
        // If the symptom exists, update the intensity
        return {
          ...existingSymptom,
          intensity: symptom.intensity,
        };
      } else {
        // If the symptom doesn't exist, create a new one
        return {
          symptom: symptom.symptom,
          intensity: symptom.intensity || 0,
        };
      }
    });

    // If the document doesn't exist, create it; otherwise, update it
    if (symptomDoc.exists()) {
      await updateDoc(symptomDocRef, {
        symptoms: updatedSymptoms, // Replace the entire symptoms array
      });
    } else {
      await setDoc(symptomDocRef, {
        symptoms: updatedSymptoms, // Create the new document with the symptoms
      });
    }
  } catch (error) {
    console.error("Error adding or updating symptoms:", error);
    throw error;
  }
};

// Fetch symptoms for a specific user on a specific date, including intensity values
export const fetchSymptoms = async (userId, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const symptomDocRef = doc(firestore, `users/${userId}/symptomLogs/${date}`);

    const snapshot = await getDoc(symptomDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data();

      // Ensure data.symptoms is always an array
      const symptoms = data.symptoms || [];

      return symptoms.map((symptom) => ({
        name: symptom.symptom,
        intensity: symptom.intensity,
      }));
    } else {
      return []; // Return an empty array if no document exists
    }
  } catch (error) {
    console.error("Error fetching symptoms from symptomservice.js:", error);
    throw error;
  }
};

// Fetch symptoms for a week
export const fetchSymptomsForWeek = async (userId, selectedDate) => {
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

    const symptomsForWeek = [];
    const symptomLogsRef = collection(firestore, `users/${userId}/symptomLogs`);

    // Loop over all days of the week to fetch symptom log for each day
    for (
      let currentDate = moment(startOfWeek);
      currentDate.isBefore(moment(endOfWeek).add(1, "days"));
      currentDate.add(1, "days")
    ) {
      const date = currentDate.format("YYYY-MM-DD");

      const symptomDocRef = doc(
        firestore,
        `users/${userId}/symptomLogs/${date}`
      );
      const snapshot = await getDoc(symptomDocRef);

      if (snapshot.exists()) {
        const data = snapshot.data();

        // Ensure data.symptoms is always an array
        const symptoms = data.symptoms || [];

        // Add symptoms to the array for the week
        symptomsForWeek.push(
          ...symptoms.map((symptom) => ({
            name: symptom.symptom,
            intensity: symptom.intensity,
          }))
        );
      } else {
        //console.log("No symptom log found for this date:", date);
      }
    }
    return symptomsForWeek; // Return the collected symptoms for the entire week
  } catch (error) {
    console.error("Error fetching symptoms for the week:", error);
    throw error;
  }
};
