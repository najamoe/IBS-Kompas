import { StyleSheet, Text, View, Dimensions, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { LineChart } from 'react-native-chart-kit'; // Import LineChart
import { fetchWeeklyWellnessLog } from '../../services/firebase/wellnessService'; // Your data-fetching function
import moment from 'moment'; // To format the dates

const emoticons = [
  { name: "emoticon-excited-outline", color: "#006147" },
  { name: "emoticon-outline", color: "#03a137" },
  { name: "emoticon-happy-outline", color: "#4CAF50" },
  { name: "emoticon-neutral-outline", color: "#3228ed" },
  { name: "emoticon-sad-outline", color: "#ed8505" },
  { name: "emoticon-cry-outline", color: "#a65c02" },
  { name: "emoticon-sick-outline", color: "#F44336" },
];

const WellnessChart = ({ userId, selectedDate }) => {
  const [weeklyData, setWeeklyData] = useState([]); // Store data for the week
  const [loading, setLoading] = useState(true);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      // Fetch the weekly wellness log data
      const totalWellnessLog = await fetchWeeklyWellnessLog(userId, selectedDate);

      // Prepare the data for the chart
      const formattedData = totalWellnessLog.map((day) => ({
        date: day.date,
        total: isNaN(day.total) ? 0 : day.total, // Ensure total is a number
      }));

      setWeeklyData(formattedData);
    } catch (error) {
      console.error("Error fetching wellness log:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWellnessData();
  }, [userId, selectedDate]);


// Prepare chart data
const chartData = {
  labels: weeklyData.map((day) => moment(day.date).format("ddd")),
  datasets: [
    {
      data: weeklyData.map((day) => {
        // Find the index of the emoticon in the emoticons array
        const emoticonIndex = emoticons.findIndex((e) => e.name === day.emoticonType);
        return emoticonIndex >= 0 ? emoticonIndex : 0; // Default to 0 (excited) if not found
      }),
    },
  ],
};
// Format the Y-axis label to show the emoticon name
const formatYLabel = (yValue) => {
  const emoticon = emoticons[yValue];
  return emoticon ? emoticon.name : 'Unknown';
};

  const screenWidth = Dimensions.get("window").width; 

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Humør</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            width={screenWidth - 40} 
            height={240}
            chartConfig={{
              backgroundGradientFrom: "#f7f7f7",
              backgroundGradientTo: "#ffffff",
              color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
            }}
            bezier
            fromZero={true}
            verticalLabelRotation={0}
            yAxisLabel="Emotion"
            formatYLabel={formatYLabel} 
          />
        </View>
      )}
    </View>
  );
};

export default WellnessChart;

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "96%",
    height: 300,
    marginVertical: 10,
    marginLeft: "3%",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  chartWrapper: {
    alignSelf: "flex-start",
    paddingHorizontal: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    height: 240,
  },
});
