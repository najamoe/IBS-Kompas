import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { LineChart } from "react-native-chart-kit";
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

        // Check if the fetched data is an array
        if (!Array.isArray(symptomData)) {
          throw new Error("Expected symptomData to be an array");
        }

        // Transform the data for the chart
        const formattedData = symptomData.map((symptom) => ({
          name: symptom.name,
          intensity: symptom.intensity,
          date: symptom.date, // Ensure that date is included
        }));

        // Store the formatted data
        setWeeklyData(formattedData);
      } catch (error) {
        console.error("Error fetching symptoms chart:", error);
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

  const symptoms = {};

  // Start with the selected date
  const startOfWeek = moment(selectedDate).startOf("week"); // Get the first day of the week

  // Generate the dates for the whole week (7 days)
  for (let i = 0; i < 7; i++) {
    const date = startOfWeek.clone().add(i, "days"); // Increment by 1 day
    chartData.labels.push(date.format("DD/MM")); // Format date as dd/mm
  }

  // Loop through the weeklyData and organize the symptoms
  weeklyData.forEach((dayData) => {
    const dateFormatted = moment(dayData.date).format("DD/MM");
    // Directly update symptom data based on the `symptom` name
    if (!symptoms[dayData.name]) {
      symptoms[dayData.name] = {
        data: Array(7).fill(0), // Initialize all days with 0
        color: symptomColorPalette[dayData.name] || "#000000",
        strokeWidth: 2,
      };
    }

    // Find the index of the current day and update the count
    const dayIndex = chartData.labels.indexOf(dateFormatted);
    if (dayIndex !== -1) {
      symptoms[dayData.name].data[dayIndex] = dayData.intensity;
    }
  });

  // Convert symptom data into datasets
  chartData.datasets = Object.keys(symptoms).map((symptom) => ({
    data: symptoms[symptom].data,
    color: () => symptoms[symptom].color,
    strokeWidth: symptoms[symptom].strokeWidth,
    withDots: true, // Show points on the line
    withInnerLines: false,
    withOuterLines: false,
    // Add dashed lines for overlapping lines (optional)
    dash: symptoms[symptom].data.some((val, index, arr) => {
      return arr.filter((v) => v === val).length > 1; // If multiple points have the same value
    })
      ? [6, 3]
      : [], // Dash style for overlapping lines
  }));

  // Chart configuration
  const chartConfig = {
    backgroundColor: "#cae9f5",
    backgroundGradientFrom: "#ffffff",
    backgroundGradientTo: "#cae9f5",
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    propsForDots: {
      r: "3", 
      strokeWidth: "0.5",
      stroke: "#fff",
    },
  };

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
            width={350}
            height={380}
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier
          />
        </View>
      )}

      {/* Custom Legend */}
      <View style={styles.legendContainer}>
        {Object.keys(symptoms).map((symptomName) => (
          <View key={symptomName} style={styles.legendItem}>
            <View
              style={[
                styles.colorCircle,
                { backgroundColor: symptoms[symptomName].color },
              ]}
            />
            <Text style={styles.legendText}>{symptomName}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SymptomChart;

const styles = StyleSheet.create({
  container: {
    width: "98%",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 480, 
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
  legendContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 10,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 10,
    marginBottom: 5,
  },
  colorCircle: {
    width: 15,
    height: 15,
    borderRadius: 50,
    marginRight: 5,
  },
  legendText: {
    fontSize: 14,
    color: "#000",
  },
});
