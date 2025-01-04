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
       console.log("Symptom data fetched in CHART:", symptomData);

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

       console.log("Formatted data for CHART:", formattedData);

       // Store the formatted data
       setWeeklyData(formattedData);
     } catch (error) {
       console.error("Error fetching symptoms cHART:", error);
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

 // Loop through the weeklyData and organize the symptoms
 weeklyData.forEach((dayData) => {
   chartData.labels.push(moment(dayData.date).format("DD/MM")); // Format date as dd/mm

   // Directly update symptom data based on the `symptom` name
   if (!symptoms[dayData.name]) {
     symptoms[dayData.name] = {
       data: Array(weeklyData.length).fill(0), // Initialize all days with 0
       color: symptomColorPalette[dayData.name] || "#000000",
       strokeWidth: 2,
     };
   }

   // Find the index of the current day and update the count
   const dayIndex = chartData.labels.indexOf(
     moment(dayData.date).format("DD/MM")
   );
   symptoms[dayData.name].data[dayIndex] = dayData.intensity;
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

 // Chart configuration
 const chartConfig = {
   backgroundColor: "#cae9f5",
   backgroundGradientFrom: "#cae9f5",
   backgroundGradientTo: "#cae9f5",
   decimalPlaces: 0,
   color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
   labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
   style: {
     borderRadius: 16,
   },
   propsForDots: {
     r: "4", // Size of dots
     strokeWidth: "2",
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
            height={250} 
            yAxisInterval={1}
            chartConfig={chartConfig}
            bezier 
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
