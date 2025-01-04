import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider"; // Add Slider import if it's missing
import { addSymptoms } from "../../services/firebase/symptomService";
import Toast from "react-native-toast-message"; // Import Toast to show notifications

const SymptomDisplay = ({ user, selectedDate }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
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

  const handleSliderChange = async (symptom, value) => {
    setSymptomIntensities((prev) => ({
      ...prev,
      [symptom]: value,
    }));

    if (!selectedSymptoms.includes(symptom)) {
      setSelectedSymptoms((prev) => [...prev, symptom]);
    }

    // Save the symptom data immediately when the slider is changed
    try {
      const symptomsToSave = [
        {
          symptom: symptom,
          intensity: value || 0, // Default to 0 if intensity is not set
        },
      ];
      await addSymptoms(user.uid, selectedDate, symptomsToSave);
      Toast.show({
        type: "success",
        text1: "Symptom saved successfully!",
      });
    } catch (error) {
      console.error("Error saving symptom:", error);
      Toast.show({
        type: "error",
        text1: "Failed to save symptom. Please try again.",
      });
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
            value={symptomIntensities[symptomOption.value] || 0} // Use 0 as default if no intensity
            onValueChange={(value) =>
              handleSliderChange(symptomOption.value, value)
            }
          />
          <Text>Intensity: {symptomIntensities[symptomOption.value] || 0}</Text>
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
