import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";
import {
  fetchWeeklyBowelLogByFrequency,
  fetchWeeklyBowelLogByType,
} from "../../services/firebase/bowelService";

export const BowelChartByFrequency = ({ userId, startDate, endDate }) => {
  const [weeklyData, setWeeklyData] = useState([]); // Store data for the week
  const [loading, setLoading] = useState(true);

  const fetchBowelData = async () => {
    try {
      setLoading(true);
      // Fetch the weekly bowel log data (daily values)
      const bowelLogs = await fetchWeeklyBowelLogByFrequency(
        userId,
        startDate,
        endDate
      );


      // Prepare the data for the chart
      const formattedData = bowelLogs.map((day) => ({
        date: day.date,
        total: isNaN(day.total) ? 0 : day.total, // Ensure total is a number
      }));

      setWeeklyData(formattedData);
    } catch (error) {
      console.error("Error fetching weekly bowel log from bowelChart.js:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBowelData();
  }, [userId, startDate, endDate]);

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: "#fff",
    backgroundGradientTo: "#fff",
    decimalPlaces: 0,

    color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: "4",
      strokeWidth: "2",
      stroke: "blue",
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


  return (
    <View style={styles.chartContainer}>
      {/* Centered Title */}
      <Text style={styles.title}>Gennemsnitligt toiletbesøg</Text>

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

export const BowelChartByType = ({  }) => {


  return (
    <View>
      <Text>bowelChart</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 100, //Edit margin when foodGraph is added
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
