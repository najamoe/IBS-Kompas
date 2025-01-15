import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient"; 
import {
  addSymptoms,
  fetchSymptoms,
} from "../../services/firebase/symptomService";

const SymptomDisplay = ({ user, selectedDate }) => {
  const [symptomIntensities, setSymptomIntensities] = useState({});
  const [currentIntensity, setCurrentIntensity] = useState(null); // To track the currently selected intensity
  const [showIntensity, setShowIntensity] = useState(false); // Controls visibility of intensity value
  const [loading, setLoading] = useState(false);
 
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
      if (!user) return; // Prevent fetch if user is not authenticated
      try {
        const symptomsFromFirestore = await fetchSymptoms(
          user.uid,
          selectedDate
        );

        if (symptomsFromFirestore.length === 0) {
          // If no symptoms exist in Firestore, initialize with default symptoms
          const defaultSymptoms = symptomOptions.map((symptom) => ({
            symptom: symptom.value,
            intensity: 0,
          }));
          await addSymptoms(user.uid, selectedDate, defaultSymptoms);
          setSymptomIntensities(
            defaultSymptoms.reduce((acc, symptom) => {
              acc[symptom.symptom] = symptom.intensity;
              return acc;
            }, {})
          );
        } else {
          // Map the fetched symptoms to the state
          const initialSymptoms = symptomOptions.reduce((acc, symptom) => {
            const fetchedSymptom = symptomsFromFirestore.find(
              (s) => s.name === symptom.value
            );
            acc[symptom.value] = fetchedSymptom ? fetchedSymptom.intensity : 0;
            return acc;
          }, {});
          setSymptomIntensities(initialSymptoms);
        }
      } catch (error) {
        console.error("Error fetching symptoms from SymptomDisplay:", error);
      } finally {
        setLoading(false); 
      }
    };

    if (user) {
      setLoading(true); // Start loading when user is available
      initializeSymptoms();
    }
  }, [user, selectedDate]);


  const handleSliderChange = (symptom, value) => {
    setSymptomIntensities((prev) => ({
      ...prev,
      [symptom]: value,
    }));
    setCurrentIntensity(value); // Update the displayed intensity value as the slider changes
    setShowIntensity(true); // Show the intensity when the slider is touched

    // Hide intensity after 3 seconds
    setTimeout(() => {
      setShowIntensity(false);
    }, 1500);
  };

  const handleSliderRelease = async () => {
    const symptomsToSave = symptomOptions.map((option) => ({
      symptom: option.value,
      intensity: symptomIntensities[option.value] || 0,
    }));

    try {
      await addSymptoms(user.uid, selectedDate, symptomsToSave);
    } catch (error) {
      console.error("Error saving symptoms:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logTitle}>Symptomer</Text>

      <View style={styles.symptomsWrapper}>
        {symptomOptions.map((symptomOption) => (
          <View key={symptomOption.value} style={styles.symptomContainer}>
            <Text style={styles.symptomLabel}>{symptomOption.label}</Text>

            <Text style={styles.valueText}>
              {" "}
              {symptomIntensities[symptomOption.value]}
            </Text>
            {/* Custom Slider with Gradient Background */}
            <LinearGradient
              colors={["green", "yellow", "red"]} // Gradient from green to yellow to red
              start={{ x: 0, y: 0 }} // Start from left 
              end={{ x: 1, y: 0 }} // End at right 
              style={styles.gradientBackground}
            >
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={symptomIntensities[symptomOption.value]} // Getting the current intensity value
                onValueChange={(value) =>
                  handleSliderChange(symptomOption.value, value)
                } // Update intensity when slider changes
                onSlidingComplete={handleSliderRelease} // Save symptoms when sliding is complete
                minimumTrackTintColor="transparent" // Set track colors via gradient background
                maximumTrackTintColor="transparent"
                thumbTintColor="white" 
              />
            </LinearGradient>
          </View>
        ))}
      </View>

      {/* Display the intensity value at the center of the screen */}
      {showIntensity && currentIntensity !== null && (
        <Text style={styles.centeredIntensity}>{currentIntensity}</Text>
      )}
    </View>
  );
};

export default SymptomDisplay;

const styles = StyleSheet.create({
  container: {
    width: "96%",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
    backgroundColor: "#ffffff",
    alignItems: "center",
    alignContent: "center",
    justifyContent: "center",
    elevation: 10,
  },
  logTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center", 
  },
  symptomsWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center", 
    width: "100%",
  },
  symptomContainer: {
    width: "45%",
    padding: 10,
    borderRadius: 20,
    margin: 5,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 10,
    marginBottom: 10,
  },
  symptomLabel: {
    marginBottom: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
  slider: {
    width: "100%",
    height: 30,
  },
  gradientBackground: {
    width: "100%",
    height: 20,
    justifyContent: "center",
    borderRadius: 15,
  },
  centeredIntensity: {
    position: "absolute",
    top: "-10%",
    left: "45%", 
    fontSize: 100, 
    fontWeight: "bold",
    color: "rgba(0, 0, 0, 0.5)", 
    backgroundColor: "transparent", 
  },
  valueText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
