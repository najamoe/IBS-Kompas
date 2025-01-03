import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  arrayUnion,
  query, 
  where,
} from "firebase/firestore";
import FirebaseConfig from "../../firebase/FirebaseConfig";

const firestore = FirebaseConfig.db;

// Add a symptom for a specific user with a given date
export const addSymptoms = async (userId, symptom, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    // Reference to the specific date document in symptomLogs
    const symptomDocRef = doc(firestore, `users/${userId}/symptomLogs/${date}`);
    

    // Prepare the symptom with the current timestamp
    const symptomWithTime = {
      symptom,
      time: new Date().toISOString(), // Store the current timestamp
    };

    // Add the new symptom to the symptoms array in the date document
    await updateDoc(symptomDocRef, {
      symptoms: arrayUnion(symptomWithTime),
    }).catch(async (error) => {
      if (error.code === "not-found") {
        // If the document doesn't exist, create it with the symptoms array
        await setDoc(symptomDocRef, {
          symptoms: [symptomWithTime],
        });
      } else {
        throw error;
      }
    });

    console.log("Symptom added:", symptomWithTime);
  } catch (error) {
    console.error("Error adding symptom:", error);
    throw error;
  }
};

// Fetch symptoms for a specific user on a specific date
export const fetchSymptoms = async (userId, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }
    // Reference to the specific symptom log document for the given date
    const symptomDocRef = doc(firestore, `users/${userId}/symptomLogs/${date}`);
    const snapshot = await getDoc(symptomDocRef);

    if (snapshot.exists()) {
      const data = snapshot.data(); // Fetch the document data
      return data.symptoms || []; // Return the symptoms array or an empty array
    } else {
      console.log("No symptom log found for this date.");
      return []; // Return an empty array if no document exists
    }
  } catch (error) {
    console.error("Error fetching symptoms:", error);
    throw error;
  }
};

// Fetch symptoms for a week
export const fetchSymptomsForWeek = async (userId, startDate, endDate) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }
    console.log("userId from fetchsymptomsforweek", userId);

    const symptomLogsRef = collection(firestore, `users/${userId}/symptomLogs`);
    const querySnapshot = await getDocs(
      query(symptomLogsRef, where("date", ">=", startDate), where("date", "<=", endDate))
    );

    const symptomsForWeek = [];
    console.log(symptomsForWeek);

    querySnapshot.forEach((doc) => {
      symptomsForWeek.push(doc.data());
    });

    return symptomsForWeek;
  } catch (error) {
    console.error("Error fetching symptoms for the week:", error);
    throw error;
  }
};


// used in home.js
export const deleteSymptom = async (userId, symptomToRemove, date) => {
  try {
    if (!firestore || !userId) {
      throw new Error("Firestore instance or userId is missing.");
    }

    const symptomDocRef = doc(firestore, `users/${userId}/symptomLogs/${date}`);
    const snapshot = await getDoc(symptomDocRef);

    if (snapshot.exists()) {
      const currentSymptoms = snapshot.data().symptoms || [];

      // Filter out the symptom to remove
      const updatedSymptoms = currentSymptoms.filter(
        (symptom) => symptom.symptom !== symptomToRemove
      );

      // Update the symptom log in Firestore with the new symptoms array
      await updateDoc(symptomDocRef, {
        symptoms: updatedSymptoms,
      });

      console.log("Symptom removed:", symptomToRemove);
    } else {
      console.log("No symptoms found for this date.");
    }
  } catch (error) {
    console.error("Error removing symptom:", error);
    throw error;
  }
};
