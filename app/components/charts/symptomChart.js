import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { PieChart } from "react-native-chart-kit";
import { fetchSymptomsForWeek } from "../../services/firebase/symptomService";

// Predefined color palette for symptoms
const symptomColorPalette = {
  krampe: "#FF6347", // Tomato red for Krampe
  kvalme: "#FFD700", // Gold for Kvalme
  oppustethed: "#32CD32", // LimeGreen for Oppustethed
  halsbrand: "#1E90FF", // DodgerBlue for Halsbrand
  feber: "#FF4500", // OrangeRed for Feber
};

const SymptomChart = ({ userId, selectedDate }) => {
  const [weeklyData, setWeeklyData] = useState([]); 
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoading(true); // Start loading
        const symptomData = await fetchSymptomsForWeek(userId, selectedDate);
        setWeeklyData(symptomData); // Store the fetched data
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      } finally {
        setLoading(false); // Stop loading after data is fetched or if error occurs
      }
    };

    fetchSymptoms();
  }, [userId, selectedDate]);

  // Prepare data for the pie chart
  const chartData = [];
  // Loop through weeklyData to count occurrences of each symptom
  weeklyData.forEach((dayData) => {
    dayData.symptoms.forEach((entry) => {
      const existingSymptom = chartData.find(
        (item) => item.name === entry.symptom
      );
      if (existingSymptom) {
        existingSymptom.value += 1; // Increment if symptom already exists
      } else {
        chartData.push({
          name: entry.symptom,
          value: 1, // Initialize value for new symptom
          color: symptomColorPalette[entry.symptom] || "#000000", // Set color from palette
        });
      }
    });
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptomer</Text>

      {/* Loading Indicator or chart */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          <PieChart
            data={chartData}
            width={350}
            height={160}
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
      )}
    </View>
  );
};

export default SymptomChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 250,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  chartWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 240,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#0000ff",
  },
});
