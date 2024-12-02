import React, { useState, useEffect, useCallback } from "react";
import {
  StyleSheet,
  RefreshControl,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  Button,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { getAuth } from "firebase/auth";
import { addDailyLog, fetchDailyLog } from "../firebase/firestoreService";
import { Calendar } from "react-native-calendars";

const Home = () => {
  // Format date function to display in DD/MM/YYYY format
  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}/${month}/${year}`; // Display format
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
  const [selectedDate, setSelectedDate] = useState(formatDateStorage(new Date()));
  const [user, setUser] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);

    // Check if the user is signed in
    useEffect(() => {
      const auth = getAuth();
      const currentUser = auth.currentUser;
      if (currentUser) {
        setUser(currentUser); // Store user info
      }
    }, []);

  // Fetch daily log when the selected date changes
  useEffect(() => {
    if (user) {
      const fetchLogData = async () => {
        try {
          const logData = await fetchDailyLog(user.uid, selectedDate);
          if (logData) {
            setWaterIntake(logData.waterIntake || 0); // Set water intake if data exists
          } else {
            setWaterIntake(0); // Set to 0 if no log data found
          }
        } catch (error) {
          console.error("Error fetching daily log:", error);
        }
      };
      fetchLogData();
    }
  }, [user, selectedDate]);

  const handleDayChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(formatDateStorage(newDate)); // Store as YYYY-MM-DD
  };

  const handleAddWater = async () => {
    if (user) {
      const userUid = user.uid; // Get the signed-in user's UID

      // Add 2 dl to the current water intake
      const newWaterIntake = waterIntake + 2;

      const logData = {
        waterIntake: newWaterIntake, // Add to the existing water intake
        timestamp: new Date().toISOString(), // Timestamp for logging
      };

      try {
        await addDailyLog(userUid, logData); // Call Firestore service to add the daily log
        setWaterIntake(newWaterIntake); // Update state with the new water intake
        
      } catch (error) {
        console.error('Error adding water to daily log:', error.message);
        
      }
    } else {
      alert('Please sign in to log your water intake.');
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
          <View style={styles.container}>
            {/* Header with date navigation */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => handleDayChange(-1)}>
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>{formatDateDisplay(selectedDate)}</Text> {/* Display in DD/MM/YYYY */}
              <TouchableOpacity onPress={() => handleDayChange(1)}>
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>

         

            {/* Daily Stats */}
            <View style={styles.statsContainer}>
            <Text>Water Intake: {waterIntake} dl</Text>
              <Button title="Add 2 dl of Water" onPress={handleAddWater} />

             
            </View>
          </View>

          <Toast />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  arrow: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007BFF",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  calendar: {
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "gray",
  },
  statsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    marginVertical: 5,
  },
});
