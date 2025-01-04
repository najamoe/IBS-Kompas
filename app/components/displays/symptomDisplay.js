import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import {
  addSymptoms,
  fetchSymptoms,
} from "../../services/firebase/symptomService";

const SymptomDisplay = ({ user, selectedDate }) => {
  const [symptomIntensities, setSymptomIntensities] = useState({});

  const symptomOptions = [
    { label: "Krampe", value: "krampe" },
    { label: "Kvalme", value: "kvalme" },
    { label: "Diarré", value: "diarré" },
    { label: "Oppustethed", value: "oppustethed" },
    { label: "Halsbrand", value: "halsbrand" },
    { label: "Feber", value: "feber" },
    { label: "Forstoppelse", value: "forstoppelse" },
  ];

  useEffect(() => {
    const initializeSymptoms = async () => {
   try {
     if (!user) {
       console.error("No user provided");
       return;
     }

     console.log("User ID from symptomDisplay:", user.uid); // Check if user.id is available

     // Fetch symptoms for the selected user and date
     const symptomsFromFirestore = await fetchSymptoms(user.uid, selectedDate);

     // Map fetched symptoms into the state object, including intensity values
     const initialSymptoms = symptomOptions.reduce((acc, symptom) => {
       const fetchedSymptom = symptomsFromFirestore.find(
         (s) => s.symptom === symptom.value
       );
       acc[symptom.value] = fetchedSymptom ? fetchedSymptom.intensity : 0;
       return acc;
     }, {});

     setSymptomIntensities(initialSymptoms);
   } catch (error) {
     console.error("Error fetching symptoms from symptomDisplay:", error);
   }
    };

    initializeSymptoms();
  }, [user, selectedDate]);


  const handleSliderChange = (symptom, value) => {
    setSymptomIntensities((prev) => ({
      ...prev,
      [symptom]: value,
    }));
  };

  const handleSliderRelease = async () => {
    const symptomsToSave = symptomOptions.map((option) => ({
      symptom: option.value,
      intensity: symptomIntensities[option.value] || 0,
    }));

    try {
      await addSymptoms(user.uid, selectedDate, symptomsToSave); // Pass user.id instead of uid
      console.log("Symptoms saved successfully", user.uid);
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logTitle}>Symptomer</Text>

      {symptomOptions.map((symptomOption) => (
        <View key={symptomOption.value} style={styles.symptomContainer}>
          <Text>{symptomOption.label}</Text>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={10}
            step={1}
            value={symptomIntensities[symptomOption.value]} // Get the current intensity value
            onValueChange={(value) =>
              handleSliderChange(symptomOption.value, value)
            } // Update intensity when slider changes
            onSlidingComplete={handleSliderRelease} // Save symptoms when sliding is complete
          />
          <Text>Intensity: {symptomIntensities[symptomOption.value]}</Text>
        </View>
      ))}
    </View>
  );
};

export default SymptomDisplay;

const styles = StyleSheet.create({
  container: {
    marginLeft: 20,
    width: "90%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 100,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 10,
  },
  symptomContainer: {
    marginLeft: 20,
    width: "90%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 10,
  },
  slider: {
    width: "100%",
    height: 30,
    color: "#1fb28a",
  },
});
