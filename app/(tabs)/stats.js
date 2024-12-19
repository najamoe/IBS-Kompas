import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { getAuth } from "firebase/auth";
import moment from "moment"; // Import moment
import WaterIntakeChart from "../components/charts/waterChart";

const Stats = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());

  // Check if the user is signed in
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser); // Store user info
    }
  }, []);

  // Handle week navigation (back and forward)
  const handleWeekChange = (weeks) => {
    const newDate = moment(selectedDate).add(weeks, "weeks");
    setSelectedDate(newDate);
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  moment.locale("da");

  // Get the start and end of the current week using moment
  const startOfWeek = selectedDate.clone().startOf("isoweek");
  const endOfWeek = selectedDate.clone().endOf("isoweek");

  // Get the current week number
  const weekNumber = selectedDate.isoWeek();

  // Format the week range
  const weekRange = `${startOfWeek.format("DD-MM-YYYY")} - ${endOfWeek.format(
    "DD-MM-YYYY"
  )}`;

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.dateContainer}>
            {/* Header with week navigation */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => handleWeekChange(-1)}>
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>
              <View style={styles.weekInfo}>
                {/* Week number display */}
                <Text style={styles.weekText}>Uge {weekNumber}</Text>
                {/* Week range display */}
                <Text style={styles.dateRangeText}>{weekRange}</Text>
              </View>
              <TouchableOpacity onPress={() => handleWeekChange(1)}>
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.graphFoodContainer}>
            <Text>Food</Text>
          </View>

          <View style={styles.graphWaterContainer}>
            <WaterIntakeChart />
          </View>

          <View style={styles.graphBowelContainer}>
            <Text>Bowel</Text>
          </View>

          <View style={styles.graphWellnessContainer}>
            <Text>Wellness</Text>
          </View>

          <View style={styles.graphSymptomContainer}>
            <Text>Symptom</Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  dateContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
    padding: 5,
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    margin: 10,
  },
  weekInfo: {
    justifyContent: "center",
    alignItems: "center", // Center align both texts
  },
  weekText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5, // Add some space between week and date range
  },
  dateRangeText: {
    fontSize: 16,
    color: "gray", // Optional: to distinguish date range visually
  },
  graphFoodContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphWaterContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphBowelContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphWellnessContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphSymptomContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
});
