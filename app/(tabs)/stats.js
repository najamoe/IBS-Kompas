import React, { useState, useCallback, useEffect } from "react";
import {
  StyleSheet,
  RefreshControl,
  ScrollView,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { getAuth } from "firebase/auth";
import moment from "moment";
import "moment/locale/da";
import WaterIntakeChart from "../components/charts/waterChart";
import WellnessChart from "../components/charts/wellnessChart";
import {
  BowelChartByFrequency,
  BowelChartByType,
  BowelDetails,
} from "../components/charts/bowelChart";
import SymptomChart from "../components/charts/symptomChart";
import FoodChart from "../components/charts/foodChart";

const Stats = () => {
  moment.locale("da");

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
    setSelectedDate(newDate); // This will trigger re-render for all charts
  };

const onRefresh = useCallback(() => {
  setRefreshing(true);

  // Trigger a date change, for example, refresh the current week or previous week
  const newDate = moment(); // You can adjust this as needed (e.g., go to today or refresh the week)
  setSelectedDate(newDate); // This will trigger the re-render of the charts with the updated date

  setTimeout(() => {
    setRefreshing(false);
  }, 200); 
}, []);


  // Get the start and end of the current week using moment
  const startOfWeek = (selectedDate || moment()).clone().startOf("isoweek");
  const endOfWeek = (selectedDate || moment()).clone().endOf("isoweek");

  // Get the current week number
  const weekNumber = moment(selectedDate || moment()).isoWeek();

  // Format the week range
  const weekRange = `${startOfWeek.format("DD-MM-YYYY")} - ${endOfWeek.format(
    "DD-MM-YYYY"
  )}`;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.dateContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleWeekChange(-1)}>
              <AntDesign style={styles.arrowIcons} name="left" size={22} />
            </TouchableOpacity>
            <View style={styles.weekInfo}>
              <Text style={styles.weekText}>Uge {weekNumber}</Text>
              <Text style={styles.dateRangeText}>{weekRange}</Text>
            </View>
            <TouchableOpacity onPress={() => handleWeekChange(1)}>
              <AntDesign style={styles.arrowIcons} name="right" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        <View>
          {user ? (
            <SymptomChart
              style={styles.graphContainer}
              userId={user.uid}
              selectedDate={selectedDate}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>

        <View>
          {user ? (
            <FoodChart
              style={styles.graphContainer}
              userId={user.uid}
              selectedDate={selectedDate}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>

        <View>
          {user ? (
            <WaterIntakeChart
              style={styles.graphContainer}
              userId={user.uid}
              selectedDate={selectedDate}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>

        <View>
          {user ? (
            <BowelChartByFrequency
              style={styles.graphContainer}
              userId={user.uid}
              selectedDate={selectedDate}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>

        <View style={styles.bowelContainer}>
          <View style={styles.bowelChild}>
            {user ? (
              <BowelChartByType
                style={styles.graphContainer}
                userId={user.uid}
                selectedDate={selectedDate}
              />
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </View>

          <View style={styles.bowelChild}>
            {user ? (
              <BowelDetails
                style={styles.graphContainer}
                userId={user.uid}
                selectedDate={selectedDate}
              />
            ) : (
              <ActivityIndicator size="large" color="#0000ff" />
            )}
          </View>
        </View>

        <View style={styles.childContainer}>
          {user ? (
            <WellnessChart
              style={styles.graphContainer}
              userId={user.uid}
              selectedDate={selectedDate}
            />
          ) : (
            <ActivityIndicator size="large" color="#0000ff" />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cae9f5",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateContainer: {
    borderRadius: 30,
    width: "90%",
    padding: 5,
    marginTop: 25,
    marginBottom: 10,
    alignSelf: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowIcons: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    margin: 10,
  },
  weekInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  weekText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  dateRangeText: {
    fontSize: 16,
    color: "gray",
  },
  graphContainer: {
    backgroundColor: "#86C5D8",
    borderRadius: 10,
    width: "100%",
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3, // Optional: add shadow for better design
  },
  bowelContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 8,
  },
  bowelChild: {
    width: "49%",
    backgroundColor: "#86C5D8",
    borderRadius: 10,
    padding: 5,
    elevation: 3,
  },
  childContainer: {
    backgroundColor: "#86C5D8",
    borderRadius: 10,
    padding: 5,
    elevation: 3,
  },
});
