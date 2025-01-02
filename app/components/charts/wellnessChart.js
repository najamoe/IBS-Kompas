import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchWeeklyWellnessLog } from "../../services/firebase/wellnessService"; // Your data-fetching function
import moment from "moment"; // To format the dates
import Icon from "react-native-vector-icons/MaterialCommunityIcons"; // Import the icon library

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
  const [mostFrequentEmoticon, setMostFrequentEmoticon] = useState(null);

  const fetchWellnessData = async () => {
    try {
      setLoading(true);
      // Fetch the weekly wellness log data and get the most frequent emoticon type
      const result = await fetchWeeklyWellnessLog(userId, selectedDate);

      // Check if it's a tie
      if (result && result.message === "Der står lige imellem") {
        // If it's a tie, display both emoticons
        setMostFrequentEmoticon({
          message: result.message,
          emoticons: result.emoticons.map((type) =>
            emoticons.find((emoticon) => emoticon.name === type)
          ),
        });
      } else {
        // If no tie, map to single emoticon details
        const emoticonDetails = emoticons.find(
          (emoticon) => emoticon.name === result
        );
        setMostFrequentEmoticon(emoticonDetails);
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
      ) : mostFrequentEmoticon ? (
        <View style={styles.chartWrapper}>
          {/* If it's a tie, display both emoticons */}
          {mostFrequentEmoticon.message === "Der står lige imellem" ? (
            <>
              <Text>{mostFrequentEmoticon.message}</Text>
              <View style={styles.emoticonContainer}>
                {mostFrequentEmoticon.emoticons.map((emoticon, index) => (
                  <Icon
                    key={index}
                    name={emoticon.name} // Pass the emoticon name to the Icon component
                    size={40} // Adjust the size as needed
                    color={emoticon.color} // Set the icon color
                    style={styles.iconSpacing}
                  />
                ))}
              </View>
            </>
          ) : (
            // Otherwise, display just the most frequent emoticon
            <Icon
              name={mostFrequentEmoticon.name} // Pass the emoticon name to the Icon component
              size={40} // Adjust the size as needed
              color={mostFrequentEmoticon.color} // Set the icon color
            />
          )}
        </View>
      ) : (
        <Text>Ingen data tilgængelig for denne uge.</Text>
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
    width: "70%",
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
  emoticonContainer: {
    flexDirection: "row", // Ensure the emoticons are side by side
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  iconSpacing: {
    marginHorizontal: 5, // Space between emoticons
  },
});
