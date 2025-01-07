import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  RefreshControl,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FoodDisplay from "../components/displays/foodDisplay";
import SymptomDisplay from "../components/displays/symptomDisplay";
import BowelDisplay from "../components/displays/bowelDisplay";
import WaterDisplay from "../components/displays/waterDisplay";
import WellnessDisplay from "../components/displays/wellnessDisplay";

const Home = () => {


  // Check if the user is signed in
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser); // Store user info
    }
  }, []);

  // Format date function to display in DD/MM/YYYY format
  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // Display format
  };

  // Format date function to store in YYYY-MM-DD format for calendar
  const formatDateStorage = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`; // Internal format for calendar
  };

    const [refreshing, setRefreshing] = useState(false);
    const [selectedDate, setSelectedDate] = useState(
      formatDateStorage(new Date())
    );
    const [user, setUser] = useState(null);
    const [symptoms, setSymptoms] = useState([]);

  const handleDayChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(formatDateStorage(newDate));
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        
        contentContainerStyle={{ paddingBottom: 100 }} // Adjust to ensure content can scroll fully
      >
        <View style={styles.dateContainer}>
          {/* Header with date navigation */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleDayChange(-1)}>
              <AntDesign style={styles.arrowIcons} name="left" size={22} />
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {formatDateDisplay(selectedDate)}
            </Text>{" "}
            <TouchableOpacity onPress={() => handleDayChange(1)}>
              <AntDesign style={styles.arrowIcons} name="right" size={22} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Daily Stats */}

        <View style={styles.foodContainer}>
          <Text style={styles.logTitle}> Madlog </Text>

          <FoodDisplay
            type="breakfast"
            user={user}
            selectedDate={selectedDate}
          />

          <FoodDisplay type="lunch" user={user} selectedDate={selectedDate} />
          <FoodDisplay type="dinner" user={user} selectedDate={selectedDate} />
          <FoodDisplay type="snack" user={user} selectedDate={selectedDate} />
        </View>

        <WaterDisplay user={user} selectedDate={selectedDate} />

        <BowelDisplay user={user} selectedDate={selectedDate} />

        <WellnessDisplay
          user={user}
          selectedDate={selectedDate}
          symptoms={symptoms}
          setSymptoms={setSymptoms}
        />

        {/* Symptom Section */}
        <SymptomDisplay
          user={user}
          selectedDate={selectedDate}
          symptoms={symptoms}
          setSymptoms={setSymptoms}
        />

        <Toast />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

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
    margin: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 600,
  },
  foodContainer: {
    width: "100%",
    padding: 10,
    borderRadius: 20,
    marginTop: 5,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 10,
  },
  foodTitle: {
    fontSize: 14,
    marginLeft: 10,
    marginTop: 10,
    fontWeight: 600,
  },
  foodContent: {
    borderColor: "grey",
    borderWidth: 0.3,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 10,
    marginBottom: 10,
    width: "95%",
    padding: 10,
    elevation: 8,
  },

  WellnessContainer: {
    width: "100%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 10,
  },
  emoticonWrapper: {
    margin: 6,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  emoticonContainer: {
    flexDirection: "row",
    elevation: 10,
  },
  selectedEmoticon: {
    backgroundColor: "#86C5D8",
    padding: 2,
  },
  logTitleContainer: {
    flexDirection: "row",
    marginTop: 5,
  },
  logTitle: {
    flexDirection: "row",
    alignItems: "center",
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
    marginRight: 10,
  },
  logTitleIcon: {
    position: "absolute",
  },
});
