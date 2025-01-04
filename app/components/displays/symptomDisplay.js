import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; // Add Slider import if it's missing
import { addSymptoms } from "../../services/firebase/symptomService";
import Toast from "react-native-toast-message"; // Import Toast to show notifications

const SymptomDisplay = ({ user, selectedDate }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [symptomIntensities, setSymptomIntensities] = useState({}); // Initialize as an object

  const symptomOptions = [
    { label: "Krampe", value: "krampe" },
    { label: "Kvalme", value: "kvalme" },
    { label: "diarré", value: "diarré" },
    { label: "Oppustethed", value: "oppustethed" },
    { label: "halsbrand", value: "halsbrand" },
    { label: "feber", value: "feber" },
    { label: "forstoppelse", value: "forstoppelse" },
  ];

  // Initialize all symptoms with default intensity (0) in the state
  useEffect(() => {
    const initialSymptoms = symptomOptions.reduce((acc, symptom) => {
      acc[symptom.value] = 0; // Set initial intensity to 0
      return acc;
    }, {});
    console.log("systemOptions", symptomOptions);
    setSymptoms(symptomOptions);
    console.log("initialSymptoms", initialSymptoms);
    setSymptomIntensities(initialSymptoms);
  }, []);

  const handleSliderChange = async (symptom, value) => {
    // Update the intensity of the changed symptom in the state
    setSymptomIntensities((prev) => ({
      ...prev,
      [symptom]: value,
    }));

    // Ensure that all symptoms are included, even the ones that haven't been modified
    const symptomsToSave = symptomOptions.map((option) => ({
      symptom: option.value,
      intensity: symptomIntensities[option.value] || 0, // Default to 0 if intensity is not set
    }));

    console.log("Symptoms to save:", symptomsToSave);

    // Save the symptoms data to Firestore
    try {
      await addSymptoms(user.uid, selectedDate, symptomsToSave);
        console.log("Symptoms saved successfully");
    } catch (error) {
      console.error("Error saving symptom:", error);
    
    }
  };



  return (
    <View style={styles.symptomContainer}>
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
          />
          <Text>Intensity: {symptomIntensities[symptomOption.value]}</Text>
        </View>
      ))}
    </View>
  );
};

export default SymptomDisplay;

const styles = StyleSheet.create({
  symptomContainer: {
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
  symptomItem: {
    marginBottom: 0,
  },
  symptomLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  slider: {
    width: "100%",
    height: 40,
    color: "#1fb28a",
  },
  sliderValue: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 5,
  },
});
