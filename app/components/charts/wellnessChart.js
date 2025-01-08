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

      if (result) {
        // Convert the result array into an object for easier lookup
        const data = result.reduce((acc, { name, count }) => {
          acc[name] = count; // Map emoticon name to count
          return acc;
        }, {});
          setWeeklyData(data); // Store the emoticon counts for display
        }; // Add closing brace for try block
   
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
    backgroundColor: "white",
    borderRadius: 10,
    height: 150,
    width: "96%",
    marginVertical: 20,
    marginHorizontal: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    borderColor: "#ADD8E6",
    borderWidth: 6,
  },

  chartWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
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
    alignItems: "center",
    marginTop: 10,
    marginHorizontal: 3,
  },
  iconSpacing: {
    marginHorizontal: 5,
  },
  countText: {
    marginTop: 5,
    fontSize: 16,
    fontWeight: "bold",
  },
});
