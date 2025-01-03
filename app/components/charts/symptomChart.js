import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { StackedBarChart } from "react-native-chart-kit";
import { fetchSymptomsForWeek } from "../../services/firebase/symptomService";
import moment from "moment";

// Predefined color palette for symptoms
const symptomColorPalette = {
  krampe: "#FF6347", // Tomato red for Headache
  kvalme: "#FFD700", // Gold for Fever
  oppustethed: "#32CD32", // LimeGreen for Nausea
  halsbrand: "#1E90FF", // DodgerBlue for Fatigue
  feber: "#FF4500", // OrangeRed for Cough
};

const SymptomChart = () => {
  const [loading, setLoading] = useState(true);
  const [symptomData, setSymptomData] = useState([]);
  const [dates, setDates] = useState([]);
  const [symptomColors, setSymptomColors] = useState({});

  useEffect(() => {
    const fetchSymptoms = async () => {
      const startDate = moment().startOf("isoWeek").format("YYYY-MM-DD");
      const endDate = moment().endOf("isoWeek").format("YYYY-MM-DD");

      try {
        const symptomsForWeek = await fetchSymptomsForWeek(
          "userId",
          startDate,
          endDate
        );
        const formattedData = processSymptomsData(symptomsForWeek);

        setSymptomData(formattedData.symptomsByDay);
        setDates(formattedData.dates);
        setSymptomColors(formattedData.symptomColors);
        setLoading(false); // Set loading to false after data is fetched
      } catch (error) {
        console.error("Error fetching symptoms:", error);
        setLoading(false); // Set loading to false in case of an error
      }
    };

    fetchSymptoms();
  }, []);

  // Process symptoms data to format it for the chart
  const processSymptomsData = (symptomsForWeek) => {
    let dates = [];
    let symptomsByDay = [];
    let symptomColors = {};

    symptomsForWeek.forEach((dayData) => {
      const { date, symptoms } = dayData;
      dates.push(date);

      // Create an object to count each symptom's occurrences
      let symptomCounts = {};
      symptoms.forEach((symptom) => {
        if (!symptomCounts[symptom.symptom]) {
          symptomCounts[symptom.symptom] = 0;
        }
        symptomCounts[symptom.symptom]++;
      });

      // Convert the symptom counts to an array of numbers (for stacked bars)
      let symptomValues = Object.keys(symptomCounts).map((symptom) => {
        // Use the predefined color for each symptom from the palette
        symptomColors[symptom] = symptomColorPalette[symptom] || "#808080"; // Default to gray if not defined
        return symptomCounts[symptom];
      });

      symptomsByDay.push(symptomValues);
    });

    return {
      symptomsByDay,
      dates,
      symptomColors,
    };
  };

  // Format datasets with color mapping
  const formatDatasets = () => {
    const datasets = Object.keys(symptomColors).map((symptom, index) => {
      const symptomDataForChart = symptomData.map((symptomValues, i) => {
        const symptomIndex = Object.keys(symptomColors).indexOf(symptom);
        return symptomValues[symptomIndex] || 0;
      });

      return {
        data: symptomDataForChart,
        color: () => symptomColors[symptom], // Use the assigned color
      };
    });

    return datasets;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Symptom Chart</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : dates.length > 0 && symptomData.length > 0 ? (
        <StackedBarChart
          data={{
            labels: dates,
            datasets: formatDatasets(),
          }}
          width={300}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          withHorizontalLabels
          fromZero
          withStackedBars
        />
      ) : (
        <Text>Ingen symptomer for denne uge.</Text>
      )}
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
});
