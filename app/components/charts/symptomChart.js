import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit"; // Import LineChart
import { fetchSymptomsForWeek } from "../../services/firebase/symptomService";
import moment from "moment";

// Predefined color palette for symptoms
const symptomColorPalette = {
  krampe: "#FF6347", // Tomato red for Krampe
  kvalme: "#FFD700", // Gold for Kvalme
  oppustethed: "#32CD32", // LimeGreen for Oppustethed
  halsbrand: "#1E90FF", // DodgerBlue for Halsbrand
  feber: "#FF4500", // OrangeRed for Feber
  diarré: "#FF69B4", // HotPink for Diarre
  forstoppelse: "#8A2BE2", // BlueViolet for Forstoppelse
};

const SymptomChart = ({ userId, selectedDate }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSymptoms = async () => {
      try {
        setLoading(true);
        const symptomData = await fetchSymptomsForWeek(userId, selectedDate);
        setWeeklyData(symptomData); // Store the fetched data
      } catch (error) {
        console.error("Error fetching symptoms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSymptoms();
  }, [userId, selectedDate]);

  // Prepare data for the LineChart
  const chartData = {
    labels: [], // Days of the week
    datasets: [], // Symptom datasets
  };

  // Track which symptoms are present across days
  const symptoms = {};

  // Loop through the weeklyData and organize the symptoms
 weeklyData.forEach((dayData) => {
   chartData.labels.push(moment(dayData.date).format("DD/MM")); // Format date as dd/mm

   dayData.symptoms.forEach((entry) => {
     // Initialize dataset for this symptom if not already present
     if (!symptoms[entry.symptom]) {
       symptoms[entry.symptom] = {
         data: Array(weeklyData.length).fill(0), // Initialize all days with 0
         color: symptomColorPalette[entry.symptom] || "#000000",
         strokeWidth: 2,
       };
     }

     // Find the index of the current day and update the count
     const dayIndex = chartData.labels.indexOf(
       moment(dayData.date).format("DD/MM")
     );
     symptoms[entry.symptom].data[dayIndex] =
       (symptoms[entry.symptom].data[dayIndex] || 0) + 1;
   });
 });


  // Convert symptom data into datasets
  chartData.datasets = Object.keys(symptoms).map((symptom) => ({
    data: symptoms[symptom].data,
    color: () => symptoms[symptom].color,
    strokeWidth: symptoms[symptom].strokeWidth,
    withDots: true, // Show points on the line
    withInnerLines: false,
    withOuterLines: false,
  }));

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
          <LineChart
            data={chartData}
            width={350} // Adjust width for your layout
            height={250} // Adjust height for your layout
            chartConfig={{
              backgroundColor: "#cae9f5",
              backgroundGradientFrom: "#cae9f5",
              backgroundGradientTo: "#cae9f5",
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity}) `,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "6", // Size of dots
                strokeWidth: "2",
                stroke: "#fff",
              },
            }}
            bezier // Use Bezier curve for smooth lines
            fromZero={true} // Start from zero for better visibility
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
    height: 300, // Adjust container height
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
