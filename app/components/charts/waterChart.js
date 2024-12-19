import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { fetchWeeklyWaterIntake } from "../../services/firebase/waterService"; 
import moment from "moment"; 

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
    labels: weeklyData.map((day) => moment(day.date).format("ddd")), //Data on x-axis
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
      {/* Centered Title */}
      <Text style={styles.title}>Ugentligt væskeindtag</Text>
  
      {/* LineChart with left margin */}
      <View style={styles.chartWrapper}>
        <LineChart
          data={chartData}
          width={350}
          height={240}
          verticalLabelRotation={0}
          chartConfig={chartConfig}
          bezier
        />
      </View>
    </View>
  );
};

export default WaterIntakeChart;


const styles = StyleSheet.create({
  chartContainer: {  
    marginTop: 200,
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 300,
    marginVertical: 10,
    marginLeft: "3%", 
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  chartWrapper: {
    marginLeft: 0, 
    alignSelf: "flex-start", 
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  
});


