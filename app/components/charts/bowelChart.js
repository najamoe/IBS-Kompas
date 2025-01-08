import { StyleSheet, Text, View, ActivityIndicator, Image, Alert } from "react-native";
import React, { useState, useEffect } from "react";
import moment from "moment";
import { LineChart } from "react-native-chart-kit";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  fetchWeeklyBowelLogByFrequency,
  fetchWeeklyBowelLogByType,
  fetchBowelLogDetails
 
} from "../../services/firebase/bowelService";

// Import bowel type images
import type1 from "../../../assets/images/bowel/type1.png";
import type2 from "../../../assets/images/bowel/type2.png";
import type3 from "../../../assets/images/bowel/type3.png";
import type4 from "../../../assets/images/bowel/type4.png";
import type5 from "../../../assets/images/bowel/type5.png";
import type6 from "../../../assets/images/bowel/type6.png";
import type7 from "../../../assets/images/bowel/type7.png";

// Helper function for loading or data state
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
  return <Text>{data || noDataMessage}</Text>;
};

// Chart configuration
const chartConfig = {
  backgroundGradientFrom: "#fff",
  backgroundGradientTo: "#fff",
  decimalPlaces: 0,
  color: (opacity = 1) => `rgba(0, 102, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
  style: { borderRadius: 16 },
  propsForDots: { r: "2", strokeWidth: "2", stroke: "red" },
  yAxisMax: 10,
};

// Chart by frequency 
export const BowelChartByFrequency = ({ userId, selectedDate }) => {
  const [weeklyData, setWeeklyData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBowelData = async () => {
      try {
        setLoading(true);
        const bowelLogs = await fetchWeeklyBowelLogByFrequency(
          userId,
          selectedDate
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
  }, [userId, selectedDate]);

  const chartData = {
    labels: weeklyData.map((day) => moment(day.date).format("ddd")),
    datasets: [{ data: weeklyData.map((day) => day.total) }],
  };

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Toiletbesøg</Text>
      {loading || !weeklyData.length ? (
        <LoadingOrData loading={loading} />
      ) : (
        <LineChart
          data={chartData}
          width={310}
          height={220}
          chartConfig={chartConfig}
        />
      )}
    </View>
  );
};

// Chart by type 
export const BowelChartByType = ({ userId, selectedDate }) => {
  const [loading, setLoading] = useState(true);
  const [mostFrequentType, setMostFrequentType] = useState(null);

  const bowelTypeImages = {
    type1,
    type2,
    type3,
    type4,
    type5,
    type6,
    type7,
  };
  const formatBowelType = (type) => {
    if (!type) return null;
    return type.replace(/type(\d)/, "Type $1"); // Converts "type4" to "Type 4"
  };

  useEffect(() => {
    const fetchBowelByType = async () => {
      try {
        setLoading(true);
        const data = await fetchWeeklyBowelLogByType(userId, selectedDate);
        setMostFrequentType(data?.mostFrequentType);
      } catch (error) {
        console.error("Error fetching bowel log by type:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBowelByType();
  }, [userId, selectedDate]);

  // Render content based on loading state and data availability
  if (loading) {
    return <LoadingOrData loading={loading} />;
  }

  if (!mostFrequentType) {
    return (
      <View style={styles.detailContainer}>
        <Text>Ingen data tilgængelig for denne uge.</Text>
      </View>
    );
  }

  return (
    <View style={styles.frequentContainer}>
      <Text style={styles.typeText}>Type</Text>
      <Text style= {styles.frequentText}>
        Din mest almindelige afføringstype denne uge er{" "} {"\n"}
        <Text style={styles.boldText}>{formatBowelType(mostFrequentType)}</Text>
      </Text>
      {mostFrequentType && bowelTypeImages[mostFrequentType] && (
        <Image
          source={bowelTypeImages[mostFrequentType]}
          style={styles.typeImage}
          resizeMode="contain"
        />
      )}
    </View>
  );
};

// Detailed bowel data component
export const BowelDetails = ({ userId, selectedDate }) => {
  const [loading, setLoading] = useState(true);
  const [averageLogs, setAverageLogs] = useState(null);
  const [bloodLogsData, setBloodLogsData] = useState(null);
  const [painLogsData, setPainLogsData] = useState(null);
  const [urgentLogsData, setUrgentLogsData] = useState(null);

  useEffect(() => {
    const fetchBowelData = async () => {
      try {
        setLoading(true);

        // Fetch the details for each log type
        const averageLogs = await fetchBowelLogDetails(
          userId,
          selectedDate,
          "averageBowelLogs"
        );
        const bloodLogs = await fetchBowelLogDetails(
          userId,
          selectedDate,
          "bloodLogs"
        );
        const painLogs = await fetchBowelLogDetails(
          userId,
          selectedDate,
          "painLogs"
        );
        const urgentLogs = await fetchBowelLogDetails(
          userId,
          selectedDate,
          "urgentLogs"
        );

        // Set the fetched data to the state
        setAverageLogs(averageLogs.toFixed(2)); // Average for the week
        setBloodLogsData(bloodLogs); // Blood logs count
        setPainLogsData(painLogs); // Pain logs average
        setUrgentLogsData(urgentLogs); // Urgent logs count
      } catch (error) {
        console.error("Error fetching detailed bowel logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBowelData();
  }, [userId, selectedDate]);

  return (
    <View style={styles.detailContainer}>
      {loading ? (
        <LoadingOrData loading={loading} />
      ) : (
        <View style={styles.TextContainer}>
          <MaterialCommunityIcons name="information-outline" size={24} color="black" style={styles.infoIcon}
          onPress={() => Alert.alert('Information','Hvis du lige har tilføjet en ny afføringstype, opdater siden for at se de nyeste data.')}
          />
          <Text style={styles.title}>Detaljer</Text>
          <Text style={styles.message}>
            I denne uge har du gennemsnitligt haft{" "}
            <Text style={styles.boldText}>{averageLogs}</Text> toiletbesøg per
            dag.
            {"\n"}Du har observeret blod{" "}
            <Text style={styles.boldText}>{bloodLogsData}</Text> antal gange.
            {"\n"}Din gennemsnitlige smerte var{" "}
            <Text style={styles.boldText}>{painLogsData}</Text>.{"\n"}Du havde{" "}
            <Text style={styles.boldText}>{urgentLogsData}</Text> gange hvor det
            var hastende.
          </Text>
        </View>
      )}
    </View>
  );
};



// Styles
const styles = StyleSheet.create({
  chartContainer: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    height: 300,
    width: "96%",
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "#86C5D8",
    borderWidth: 6,
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
    backgroundColor: "white",
    
  },
  typeImage: {
    width: 60,
    height: 60,
    marginBottom: 5,
  },
  detailContainer: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 10,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "#86C5D8", 
    borderWidth: 6,
  },
  typeText: {
    fontSize: 20,
    fontWeight: "400",
    marginBottom: 10,
  },
  frequentText: {
    textAlign: "center",
  },
  frequentContainer: {
    padding: 5,
    backgroundColor: "white",
    borderRadius: 10,
    height: 250,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderColor: "#86C5D8", 
    borderWidth: 6,
  },
  TextContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: "90%",
  },
  message: {
    fontSize: 14,
    color: "grey",
    textAlign: "center",
  },
  boldText: {
    fontWeight: "bold",
  },
  infoIcon: {
    position: "absolute",
    right: 5,
    top: -20,
  },
});
