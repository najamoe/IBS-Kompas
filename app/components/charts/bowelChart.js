import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";
import {
  fetchWeeklyBowelLogByFrequency,
  fetchWeeklyBowelLogByType,
  averageBowelLogs,
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

      console.log("Chart Data", chartData.datasets[0].data); // Log chart data

      setWeeklyData(formattedData);
    } catch (error) {
      console.error(
        "Error fetching weekly bowel log from bowelChart.js:",
        error
      );
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
      r: "2",
      strokeWidth: "2",
      stroke: "red",
    },
  };

  // Prepare data for the chart
  const chartData = {
    labels: weeklyData.map((day) => moment(day.date).format("ddd")), //Data on x-axis
    datasets: [
      {
        data: weeklyData.map((day) => day.total), // Bowel intake amounts for each day
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
          />
        </View>
      )}
    </View>
  );
};

// Import all the images
import type1 from "../../../assets/images/bowel/type1.png";
import type2 from "../../../assets/images/bowel/type2.png";
import type3 from "../../../assets/images/bowel/type3.png";
import type4 from "../../../assets/images/bowel/type4.png";
import type5 from "../../../assets/images/bowel/type5.png";
import type6 from "../../../assets/images/bowel/type6.png";
import type7 from "../../../assets/images/bowel/type7.png";

export const BowelChartByType = ({ userId, startDate, endDate }) => {
  const [loading, setLoading] = useState(true);
  const [mostFrequentType, setMostFrequentType] = useState(null); // Store the most frequent type
  const [formattedAverageLogs, setFormattedAverageLogs] = useState(null); // Store the formatted average bowel logs

  const fetchBowelTypeData = async () => {
    try {
      setLoading(true);

      const { mostFrequentType } = await fetchWeeklyBowelLogByType(
        userId,
        startDate,
        endDate
      );

      setMostFrequentType(mostFrequentType);

      // Fetch and calculate average bowel logs for the week
      const average = await averageBowelLogs(userId, startDate);
      const formattedAverage = average.toFixed(2); // Format to two decimal places
      setFormattedAverageLogs(formattedAverage);
    } catch (error) {
      console.error(
        "Error fetching bowel log by type from bowelchart.js:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBowelTypeData();
  }, [userId, startDate, endDate]);

  // Map bowel types to their corresponding images
  const bowelTypeImages = {
    type1: type1,
    type2: type2,
    type3: type3,
    type4: type4,
    type5: type5,
    type6: type6,
    type7: type7,
  };

  return (
    <View style={styles.countAndTypeContainer}>
      <View style={styles.countContainer}>
        <Text style={styles.title}>Antal toiletbesøg</Text>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : formattedAverageLogs ? (
          <View style={styles.chartWrapper}>
            <Text>{formattedAverageLogs}</Text>
          </View>
        ) : (
          <Text>Ingen data tilgængelig for denne uge.</Text>
        )}
      </View>

      {/* Bowel by Type */}
      <View style={styles.frequentTypeContainer}>
        {/* Centered Title */}
        <Text style={styles.title}>Oftest type af afføring</Text>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading...</Text>
          </View>
        ) : mostFrequentType ? (
          <View style={styles.chartWrapper}>
            <Image
              source={bowelTypeImages[mostFrequentType]}
              style={styles.bowelImage}
            />
            <Text> {mostFrequentType}</Text>
          </View>
        ) : (
          <Text>Ingen type tilgængelig for denne uge.</Text>
        )}
      </View>
    </View>
  );
};

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
    alignItems: "center",
    justifyContent: "center",
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
  bowelImage: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  countAndTypeContainer: {
    flexDirection: "row",

    padding: 20,

    backgroundColor: "pink",
  },
  frequentTypeContainer: {
    width: "50%",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 200,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  countContainer: {
    width: "50%",
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 200,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
});
