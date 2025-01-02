import { StyleSheet, Text, View, ActivityIndicator, Image } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";
import {
  fetchWeeklyBowelLogByFrequency,
  fetchWeeklyBowelLogByType,
  averageBowelLogs,
  fetchAverageBloodLogs,
} from "../../services/firebase/bowelService";

// Import bowel type images
import type1 from "../../../assets/images/bowel/type1.png";
import type2 from "../../../assets/images/bowel/type2.png";
import type3 from "../../../assets/images/bowel/type3.png";
import type4 from "../../../assets/images/bowel/type4.png";
import type5 from "../../../assets/images/bowel/type5.png";
import type6 from "../../../assets/images/bowel/type6.png";
import type7 from "../../../assets/images/bowel/type7.png";

// Helper function to render loading or data state
const LoadingOrData = ({
  loading,
  data,
  noDataMessage = "Ingen data tilgængelig for denne uge.",
}) => {
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading...</Text>
      </View>
    );
  }
  return data ? <Text>{data}</Text> : <Text>{noDataMessage}</Text>;
};

// Chart configuration for bowel frequency
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

export const BowelChartByFrequency = ({ userId, startDate, endDate }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBowelData = async () => {
      try {
        setLoading(true);
        const bowelLogs = await fetchWeeklyBowelLogByFrequency(
          userId,
          startDate,
          endDate
        );
        const formattedData = bowelLogs.map((day) => ({
          date: day.date,
          total: isNaN(day.total) ? 0 : day.total,
        }));
        setWeeklyData(formattedData);
      } catch (error) {
        console.error("Error fetching weekly bowel log by frequency:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBowelData();
  }, [userId, startDate, endDate]);

  const chartData = {
    labels: weeklyData.map((day) => moment(day.date).format("ddd")),
    datasets: [
      {
        data: weeklyData.map((day) => day.total),
      },
    ],
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Toiletbesøg</Text>
      {loading || !weeklyData.length ? (
        <LoadingOrData loading={loading} data={null} />
      ) : (
        <LineChart
          data={chartData}
          width={310}
          height={240}
          verticalLabelRotation={0}
          chartConfig={chartConfig}
        />
      )}
    </View>
  );
};

export const BowelDetails = ({ userId, startDate, endDate }) => {
  const [loading, setLoading] = useState(true);
  const [mostFrequentType, setMostFrequentType] = useState(null);
  const [formattedAverageLogs, setFormattedAverageLogs] = useState(null);
  const [bloodLogsData, setBloodLogsData] = useState(null);

  useEffect(() => {
    const fetchBowelTypeData = async () => {
      try {
        setLoading(true);
        const { mostFrequentType } = await fetchWeeklyBowelLogByType(
          userId,
          startDate,
          endDate
        );
        setMostFrequentType(mostFrequentType);

        const average = await averageBowelLogs(userId, startDate);
        setFormattedAverageLogs(average.toFixed(2));

        const bloodLogs = await fetchAverageBloodLogs(userId, startDate);
        setBloodLogsData(bloodLogs);
      } catch (error) {
        console.error("Error fetching bowel log by type:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBowelTypeData();
  }, [userId, startDate, endDate]);

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
     <View style={styles.container}>
      {loading ? (
        <LoadingOrData loading={loading} data={null} />
      ) : (
        <Text style={styles.message}>
          I denne uge har du gennemsnitligt haft {formattedAverageLogs} toiletbesøg per dag.
          {"\n"}
          Din mest almindelige afføringstype denne uge er{" "}
          {mostFrequentType ? mostFrequentType : "Ingen type tilgængelig for denne uge."}.
          {"\n"}
          Du har observeret blod {bloodLogsData} antal gange.
        </Text>
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
    fontSize: 14,
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
