import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        const symptomData = await fetchSymptomsForWeek(
          userId,
          moment().format("YYYY-MM-DD")
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

  const chartData = [];
  symptoms.forEach((dayData) => {
    dayData.symptoms.forEach((entry) => {
      const existingSymptom = chartData.find(
        (item) => item.name === entry.symptom
      );
      if (existingSymptom) {
        existingSymptom.value += 1;
      } else {
        chartData.push({
          name: entry.symptom,
          value: 1,
          color: symptomColorPalette[entry.symptom] || "#000000",
        });
      }
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptom Distribution</Text>

      <PieChart
        data={chartData}
        width={350}
        height={220}
        chartConfig={{
          backgroundColor: "#1e2923",
          backgroundGradientFrom: "#08130D",
          backgroundGradientTo: "#08130D",
          decimalPlaces: 0,
          color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
          style: {
            borderRadius: 16,
          },
        }}
        accessor="value"
        backgroundColor="transparent"
      />
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
