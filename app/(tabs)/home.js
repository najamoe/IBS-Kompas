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
import FontAwesomeIcon from "react-native-vector-icons/FontAwesome";
import FontAwesomeIcons from "react-native-vector-icons/FontAwesome5";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  addWaterIntake,
  fetchWaterIntake,
  removeWaterIntake,
} from "../services/firebase/waterService";
import WaterModal from "../components/modal/waterModal";
import BowelModal from "../components/modal/bowelModal";
import {
  addWellnessLog,
  fetchWellnessLog,
} from "../services/firebase/wellnessService";
import {
  addSymptoms,
  fetchSymptoms,
} from "../services/firebase/symptomService";
import Checkbox from "../components/Checkbox"

const Home = () => {
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
  const [waterIntake, setWaterIntake] = useState(0);
  const [isWaterModalVisible, setIsWaterModalVisible] = useState(false);
  const [isBowelModalVisible, setIsBowelModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(true);
  const [selectedMood, setSelectedMood] = useState(null);
  const [symptoms, setSymptoms] = useState([]);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

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
          // Fetch water intake
          const intake = await fetchWaterIntake(user.uid, selectedDate);
          console.log("Fetched Water Intake:", intake); //LOGS
          setWaterIntake(intake);

          // Fetch wellness log
          const wellnesslog = await fetchWellnessLog(user.uid, selectedDate);
          console.log("Fetched Wellness Log:", wellnesslog); //LOGS
          setSelectedMood(wellnesslog?.emoticon || null);

         // Fetch logged symptoms for the selected date
         const symptoms = await fetchSymptoms(user.uid, selectedDate);
         console.log("Fetched Symptoms:", symptoms); //LOGS
         setSymptoms(symptoms);
        } catch (error) {
          console.error("Error fetching data:", error); //LOGS
        }
      };
      fetchWaterData();
    }
  }, [user, selectedDate]);

  useEffect(() => {
    console.log("Updated Water Intake State:", waterIntake);
    console.log("Updated Selected Mood State:", selectedMood);
  }, [waterIntake, selectedMood]);

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
      try {
        const newWaterIntake = await removeWaterIntake(
          user.uid,
          selectedDate,
          amount
        ); // Pass the amount to remove
        setWaterIntake(newWaterIntake); // Update the local state with the new value
      } catch (error) {
        console.error("Error removing water from daily log:", error.message);
      }
    } else {
      alert("Please sign in to remove water intake.");
    }
  };

  const handleAddBowel = async (type) => {};

  const emoticons = [
    { name: "emoticon-excited-outline", color: "#FFC107" },
    { name: "emoticon-outline", color: "#4CAF50" },
    { name: "emoticon-happy-outline", color: "#4CAF50" },
    { name: "emoticon-neutral-outline", color: "#FFC107" },
    { name: "emoticon-sad-outline", color: "#F44336" },
    { name: "emoticon-cry-outline", color: "#4CAF50" },
    { name: "emoticon-sick-outline", color: "#FFC107" },
  ];

  const handleEmoticonPress = async (emoticon) => {
    if (!user) {
      console.error("User not logged in");
      return;
    }

    try {
      setSelectedMood(emoticon);

      // Call addWellnessLog service to log the emoticon
      await addWellnessLog(user.uid, emoticon);

      console.log("Emoticon saved successfully:", emoticon);
    } catch (error) {
      console.error("Error saving emoticon:", error.message);
    }
  };

  const symptomOptions = [
    { label: "Krampe", value: "krampe" },
    { label: "Kvalme", value: "kvalme" },
    { label: "Oppustethed", value: "oppustethed" },
  ];
  const handleSaveSymptoms = async () => {
    if (user && selectedSymptoms.length > 0) {
      try {
        for (const symptom of selectedSymptoms) {
          await addSymptoms(user.uid, symptom, selectedDate);
        }
        alert("Symptoms saved successfully!");
        setSelectedSymptoms([]);
      } catch (error) {
        console.error("Error saving symptoms:", error);
      }
    } else {
      alert("Please select at least one symptom or sign in.");
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
              size={25}
              color={"#666666"}
              style={styles.iconContainer}
            />
          </View>

          <View style={styles.waterContainer}>
            <Ionicons
              name="water"
              size={30}
              color={"#1591ea"}
              style={styles.iconContainer}
            />

            <Text style={styles.waterIntakeText}>Væske {waterIntake} l</Text>

            <View style={styles.waterIconContainer}>
              <Ionicons
                name="remove-circle-outline"
                size={34}
                color="red"
                onPress={() => {
                  setIsWaterModalVisible(true);
                  setIsAdding(false);
                }}
              />
              <Ionicons
                name="add-circle-outline"
                size={34}
                marginLeft={10}
                color="green"
                onPress={() => {
                  setIsWaterModalVisible(true);
                  setIsAdding(true);
                }}
              />
            </View>
          </View>

          {/* modal when isWaterModalVisible is true */}
          <WaterModal
            isVisible={isWaterModalVisible}
            onClose={() => setIsWaterModalVisible(false)}
            onAddWater={isAdding ? handleAddWater : handleRemoveWater}
          />

          {/* Bowel Container */}
          <View style={styles.bowelContainer}>
            <FontAwesomeIcons
              name="toilet"
              size={26}
              color={"#8c4c1f"}
              style={styles.iconContainer}
            />
            <TouchableOpacity onPress={() => setIsBowelModalVisible(true)}>
              <Text style={styles.addBowel}>Tilføj</Text>
            </TouchableOpacity>
          </View>

          {/* Bowel Modal */}
          <BowelModal
            isVisible={isBowelModalVisible}
            onClose={() => setIsBowelModalVisible(false)}
          />

          {/* Wellness container */}
          <View style={styles.WellnessContainer}>
            {emoticons.map((icon) => (
              <TouchableOpacity
                key={icon.name}
                onPress={() => handleEmoticonPress(icon.name)}
                style={[
                  styles.emoticonWrapper,
                  selectedMood === icon.name && styles.selectedEmoticon,
                ]}
              >
                <MaterialCommunityIcons
                  name={icon.name}
                  size={selectedMood === icon.name ? 32 : 28} // Increase size if selected
                  color={selectedMood === icon.name ? "blue" : icon.color}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* symptom container */}
          <View style={styles.symptomContainer}>
            <Text style={styles.symptomTitle}>Vælg dine symptomer</Text>
            <View style={styles.symptomButtonsContainer}>
              <Checkbox
                options={symptomOptions}
                checkedValues={selectedSymptoms}
                onChange={setSelectedSymptoms}
              />
              <Button title="Save Symptoms" onPress={handleSaveSymptoms} />
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
    width: "100%",
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
  iconContainer: {
    marginLeft: 10,
  },
  foodContainer: {
    marginLeft: "10",
    flexDirection: "row",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  waterContainer: {
    marginLeft: "10",
    flexDirection: "row",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  waterIntakeText: {
    fontSize: 16,
    fontWeight: "400",
    marginLeft: 50,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 5,
    width: 140,
    textAlign: "center",
  },
  waterIconContainer: {
    flexDirection: "row",
    marginLeft: 4, // Adjusts the left space for the container
    width: "34%", // Define the width of the container to control space between icons
    paddingHorizontal: 30,
  },
  bowelContainer: {
    backgroundColor: "grey",
    marginLeft: "10",
    flexDirection: "row",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  addBowel: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: 230,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 5,
    width: 80,
    textAlign: "center",
  },
  WellnessContainer: {
    marginLeft: "10",
    flexDirection: "row",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  emoticonWrapper: {
    margin: 8,
    borderRadius: 10,
    padding: 2, // spacing for the icon inside the border
  },
  selectedEmoticon: {
    size: "30",
    borderWidth: 2,
    borderColor: "blue",
  },
  symptomContainer: {
    marginLeft: "10",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  symptomTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
