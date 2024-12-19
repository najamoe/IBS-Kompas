import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchWeeklyWaterIntake } from "../../services/firebase/waterService"; // Your function to fetch weekly intake data
import moment from "moment"; // Use moment to handle date formatting

const WaterIntakeChart = ({ userId, selectedDate }) => {
  const screenWidth = Dimensions.get("window").width;
  const [weeklyData, setWeeklyData] = useState([]); // Store data for the week
  const [loading, setLoading] = useState(true);

  const fetchWaterData = async () => {
    console.log(userId)
    try {
      setLoading(true);
      // Fetch the weekly water intake data (daily values)
      const totalWaterIntake = await fetchWeeklyWaterIntake(userId, selectedDate);
      
      console.log("Fetched Water Intake Data:", totalWaterIntake);  // Log the raw data

      // Prepare the data for the chart
      const formattedData = totalWaterIntake.map((day) => ({
        date: day.date,
        total: isNaN(day.total) ? 0 : day.total, // Ensure total is a number
      }));

      console.log("Formatted Water Intake Data:", formattedData);  // Log the formatted data
      setWeeklyData(formattedData);
    } catch (error) {
      console.error("Error fetching weekly water intake:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWaterData();
  }, [userId, selectedDate]);

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 2,
    color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "6",
      strokeWidth: "2",
      stroke: "#ffa726",
    },
  };

  // Prepare data for the chart
  const chartData = {
    labels: weeklyData.map((day) => moment(day.date).format("DD MMM")), // Format date for X-axis
    datasets: [
      {
        data: weeklyData.map((day) => day.total), // Water intake amounts for each day
      },
    ],
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Weekly Water Intake</Text>

      {/* Line Chart to display the data */}
      <LineChart
        data={chartData}
        width={screenWidth}
        height={256}
        verticalLabelRotation={30}
        chartConfig={chartConfig}
        bezier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
});

export default WaterIntakeChart;
