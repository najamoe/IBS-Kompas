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
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome'
import FontAwesomeIcons from 'react-native-vector-icons/FontAwesome5'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { addWaterIntake, fetchWaterIntake, removeWaterIntake } from "../services/firebase/waterService";
import WaterModal from "../components/modal/waterModal";

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
  const [selectedDate, setSelectedDate] = useState(
    formatDateStorage(new Date())
  );
  const [user, setUser] = useState(null);
  const [waterIntake, setWaterIntake] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(true);

  // Check if the user is signed in
  useEffect(() => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser); // Store user info
    }
  }, []);

  // Fetch daily when the selected date changes
  useEffect(() => {
    if (user) {
      const fetchWaterData = async () => {
        try {
          const intake = await fetchWaterIntake(user.uid, selectedDate);
          setWaterIntake(intake);
        } catch (error) {
          console.error("Error fetching water intake:", error);
        }
      };
      fetchWaterData();
    }
  }, [user, selectedDate]);

  const handleDayChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(formatDateStorage(newDate)); 
  };

  const handleAddWater = async (amount) => {
    if (user) {
      const newWaterIntake = waterIntake + amount;
      try {
        await addWaterIntake(user.uid, newWaterIntake); // Add the new water intake
        setWaterIntake(newWaterIntake); // Update the local state
      } catch (error) {
        console.error("Error adding water to daily log:", error.message);
      }
    } else {
      alert("Please sign in to log your water intake.");
    }
  };

  const handleRemoveWater = async (amount) => {
    if (user) {
      const newWaterIntake = waterIntake - amount;
      try {
        await removeWaterIntake(user.uid, selectedDate); // Remove the water intake for today
        setWaterIntake(newWaterIntake); // Update the local state
      } catch (error) {
        console.error("Error removing water from daily log:", error.message);
      }
    } else {
      alert("Please sign in to remove water intake.");
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
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.dateContainer}>
            {/* Header with date navigation */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => handleDayChange(-1)}>
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>
                {formatDateDisplay(selectedDate)}
              </Text>{" "}
              {/* Display in DD/MM/YYYY */}
              <TouchableOpacity onPress={() => handleDayChange(1)}>
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Daily Stats */}

          <View style={styles.foodContainer}>
            <FontAwesomeIcon
              name="cutlery"
              size={20}
              />
            <Text> Food Display</Text>
          </View>

          <View style={styles.waterContainer}>
        <Ionicons
          name="add-circle-outline" 
          size={30}
          color="green"
          onPress={() => setIsModalVisible(true)} 
        />
        <Ionicons
          name="remove-circle-outline" 
          size={30}
          color="red"
          onPress={() => { 
            setIsModalVisible(true);
            setIsAdding(false); 
          }} 
        />
        <Text>Væske {waterIntake} dl</Text>
      </View>

      {/* Show the modal when isModalVisible is true */}
      <WaterModal
            isVisible={isModalVisible}
            onClose={() => setIsModalVisible(false)} 
            onAddWater={isAdding ? handleAddWater : handleRemoveWater} 
          />

          <View style={styles.poopContainer}>
          <FontAwesomeIcons
              name="toilet"
              size={20}
              />
            <Text> Poop Display</Text>
          </View>

          <View style={styles.WellnessContainer}>
          <FontAwesomeIcon
              name="heart"
              size={20}
              />
            <Text> Wellness Display</Text>
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
    width: "100%",
    position: "relative",
    alignItems: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  dateContainer: {
    backgroundColor: "pink",
    padding: 5,
    marginTop: 40,
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
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodContainer: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  },
  waterContainer: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  },
  poopContainer: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  },
  WellnessContainer: {
    padding: 5,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
  }
});
