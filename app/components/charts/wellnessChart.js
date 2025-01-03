import { StyleSheet, Text, View, ActivityIndicator } from "react-native";
import React, { useState, useEffect } from "react";
import { fetchWeeklyWellnessLog } from "../../services/firebase/wellnessService";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

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
  const [weeklyData, setWeeklyData] = useState({}); // Store emoticon counts
  const [loading, setLoading] = useState(true);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      // Fetch the weekly wellness log data with emoticon counts
      const result = await fetchWeeklyWellnessLog(userId, selectedDate);
      console.log("Result from fetchWeeklyWellnessLog:", result);

      if (result) {
        // Convert the result array into an object for easier lookup
        const data = result.reduce((acc, { name, count }) => {
          acc[name] = count; // Map emoticon name to count
          return acc;
        }, {});
        setWeeklyData(data); // Store the emoticon counts for display
      } else {
        console.log("No data available for the selected week");
      }
    } catch (error) {
      console.error("Error fetching wellness log:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWellnessData();
  }, [userId, selectedDate]);

  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Dit gennemsnitlige humør denne uge</Text>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text>Loading...</Text>
        </View>
      ) : (
        <View style={styles.chartWrapper}>
          {emoticons.map((emoticon) => {
            // Check if the emoticon exists in weeklyData, if not set count to 0
            const count = weeklyData[emoticon.name] || 0; 

            return (
              <View key={emoticon.name} style={styles.emoticonRow}>
                <Text style={styles.countText}>{count}</Text>
                <Icon
                  name={emoticon.name}
                  size={30}
                  color={emoticon.color}
                  style={styles.iconSpacing}
                />
                
              </View>
            );
          })}
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
    height: 150,
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
    flexDirection: "row",
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
  emoticonRow: {
    flexDirection: "column", // Display emoticon and count vertically
    alignItems: "center",
    marginTop: 10,
  },
  iconSpacing: {
    marginHorizontal: 5,
  },
  countText: {
    marginTop: 5, // Add spacing above the count
    fontSize: 16,
    fontWeight: "bold",
  },
});
