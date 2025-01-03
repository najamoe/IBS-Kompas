import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { fetchSymptomsForWeek } from "../../services/firebase/symptomService";
import moment from "moment";

// Predefined color palette for symptoms
const symptomColorPalette = {
  krampe: "#FF6347", // Tomato red for Krampe
  kvalme: "#FFD700", // Gold for Kvalme
  oppustethed: "#32CD32", // LimeGreen for Oppustethed
  halsbrand: "#1E90FF", // DodgerBlue for Halsbrand
  feber: "#FF4500", // OrangeRed for Feber
};

const SymptomChart = ({ userId }) => {
  const [symptoms, setSymptoms] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const symptomData = await fetchSymptomsForWeek(
          userId,
          moment().format("YYYY-MM-DD") // Pass the current date for week start
        );
        setSymptoms(symptomData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching symptoms:", error);
        setLoading(false); // Stop loading if error occurs
      }
    };

    fetchSymptoms();
  }, [userId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  // Function to render symptom for a specific day
  const renderSymptomsForDay = (daySymptoms) => {
    if (!daySymptoms || daySymptoms.length === 0) {
      return <Text>No symptoms recorded.</Text>;
    }

    return daySymptoms.map((entry, index) => (
      <View key={index} style={styles.symptomEntry}>
        <Text
          style={[
            styles.symptomText,
            { color: symptomColorPalette[entry.symptom] || "#000000" },
          ]}
        >
          {entry.symptom}
        </Text>
      </View>
    ));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptom Chart</Text>

      <ScrollView>
        {symptoms.map((dayData, index) => {
          const date = moment(dayData.date).format("YYYY-MM-DD");
          const daySymptoms = dayData.symptoms || [];
          return (
            <View key={index} style={styles.dayContainer}>
              <Text style={styles.dateText}>{date}</Text>
              {renderSymptomsForDay(daySymptoms)}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default SymptomChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
  },
  dayContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  symptomEntry: {
    marginLeft: 10,
    marginBottom: 5,
  },
  symptomText: {
    fontSize: 16,
  },
});
