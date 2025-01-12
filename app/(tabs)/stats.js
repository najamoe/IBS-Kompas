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

    const newDate = moment();
    setSelectedDate(newDate);

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
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View style={styles.dateContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleWeekChange(-1)}>
              <AntDesign name="left" size={22} />
            </TouchableOpacity>
            <View style={styles.weekInfo}>
              <Text style={styles.weekText}>Uge {weekNumber}</Text>
              <Text style={styles.dateRangeText}>{weekRange}</Text>
            </View>
            <TouchableOpacity onPress={() => handleWeekChange(1)}>
              <AntDesign name="right" size={22} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Swipe ned for at opdatere data
          </Text>
        </View>
        <View>
          {user ? (
            <SymptomChart userId={user.uid} selectedDate={selectedDate} />
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

        {user ? (
          <WellnessChart userId={user.uid} selectedDate={selectedDate} />
        ) : (
          <ActivityIndicator size="large" color="#0000ff" />
        )}
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
    backgroundColor: "#ffffff",
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 10,
    borderColor: "#86C5D8",
    borderWidth: 1.5,
    width: "70%",
    padding: 10,
    borderRadius: 40,
    marginHorizontal: 55,
    elevation: 5,
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  weekInfo: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
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
  bowelContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 8,
  },
  bowelChild: {
    width: "49%",
  },
  infoContainer: {
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 16,
    color: "gray",
  },
});
