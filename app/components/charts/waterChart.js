import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { subscribeToWeeklyWaterIntake } from "../../services/firebase/waterService";
import moment from "moment";

const WaterIntakeChart = ({ userId, selectedDate }) => {
  const [weeklyData, setWeeklyData] = useState([]); // Store data for the week
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe;

    const fetchRealTimeData = async () => {
      setLoading(true);

      unsubscribe = subscribeToWeeklyWaterIntake(
        userId,
        selectedDate,
        (data) => {
          setWeeklyData(data);
          setLoading(false);
        }
      );
    };

    fetchRealTimeData();

    // Cleanup the subscription when the component unmounts or dependencies change
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [userId, selectedDate]);

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 1,
    yAxisSuffix: "L",
    color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "2",
      strokeWidth: "2",
      stroke: "blue",
    },
  };

  // Prepare data for the chart
  const chartData = {
    labels: weeklyData.map((day) => moment(day.date).format("ddd")), // Data on x-axis
    datasets: [
      {
        data: weeklyData.map((day) => day.total), // Water intake amounts for each day
      },
    ],
  };

  return (
    <View style={styles.chartContainer}>
      {/* Centered Title */}
      <Text style={styles.title}>Ugentligt væskeindtag</Text>

      {/* Loading Indicator or LineChart */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          <LineChart
            data={chartData}
            width={310}
            height={240}
            verticalLabelRotation={0}
            chartConfig={chartConfig}
            bezier
          />
        </View>
      )}
    </View>
  );
};

export default WaterIntakeChart;

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    width: "100%",
    height: 300,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  chartWrapper: {
    alignSelf: "flex-start",
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
