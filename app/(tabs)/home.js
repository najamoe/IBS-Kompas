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
  deleteSymptom,
} from "../services/firebase/symptomService";
import Checkbox from "../components/Checkbox";

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
  const [bowelStep, setBowelStep] = useState(1); // Default to the first step

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
          setWaterIntake(intake);

          // Fetch wellness log
          const wellnesslog = await fetchWellnessLog(user.uid, selectedDate);
          setSelectedMood(wellnesslog?.emoticon || null);

          // Fetch logged symptoms for the selected date
          const symptoms = await fetchSymptoms(user.uid, selectedDate);
          setSymptoms(symptoms);
        } catch (error) {
          console.error("Error fetching data:", error); //LOGS
        }
      };
      fetchWaterData();
    }
  }, [user, selectedDate]);

  useEffect(() => {}, [waterIntake, selectedMood]);

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
    } catch (error) {
      console.error("Error saving emoticon:", error.message);
    }
  };

  const symptomOptions = [
    { label: "Krampe", value: "krampe" },
    { label: "Kvalme", value: "kvalme" },
    { label: "Oppustethed", value: "oppustethed" },
  ];

  // useEffect to mark symptoms that are already in the array in firestore
  useEffect(() => {
    // going through the array of symptoms in firestore
    const activeSymptoms = symptoms.map((symptom) => symptom.symptom);
    setSelectedSymptoms(activeSymptoms); // Set checked symptoms
  }, [symptoms]); // effect that runs if symptom changes

  //handling deletion of a symptom
  const handleCheckboxChange = async (symptom, isChecked) => {
    if (user) {
      try {
        if (isChecked) {
          // If the checkbox is checked, add the symptom
          setSelectedSymptoms((prev) => [...prev, symptom]);
          await addSymptoms(user.uid, symptom, selectedDate); // Add the symptom to Firestore
        } else {
          // If the checkbox is unchecked, remove the symptom
          setSelectedSymptoms((prev) =>
            prev.filter((selectedSymptom) => selectedSymptom !== symptom)
          );
          await deleteSymptom(user.uid, symptom, selectedDate); // Remove the symptom from Firestore
        }
      } catch (error) {
        console.error("Error handling checkbox change:", error);
      }
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
            <Text style={styles.logTitle}>Madlog </Text>
            <View style={styles.foodContent}>
              <FontAwesomeIcon name="cutlery" size={25} color={"#666666"} />
            </View>
          </View>

          <View style={styles.waterContainer}>
            <View style={styles.logTitleContainer}>
              <Text style={styles.logTitle}>
                Tilføj væskeindtag{" "}
                <Ionicons name="water" size={22} color="#1591ea" />
              </Text>
            </View>

            <View style={styles.waterContent}>
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
          </View>

          {/* modal when isWaterModalVisible is true */}
          <WaterModal
            isVisible={isWaterModalVisible}
            onClose={() => setIsWaterModalVisible(false)}
            onAddWater={isAdding ? handleAddWater : handleRemoveWater}
          />

          {/* Bowel Container */}
          <View style={styles.bowelContainer}>
            <View style={styles.logTitleContainer}>
              <Text style={styles.logTitle}>
                Log toiletbesøg
                <FontAwesomeIcons name="toilet" size={20} color={"#8c4c1f"} />
              </Text>
            </View>

            <View style={styles.bowelContent}>
              <TouchableOpacity
                onPress={() => {
                  setIsBowelModalVisible(true);        
                  setBowelStep(1);
                }}
              >
                <Text style={styles.addBowel}>Tilføj</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bowel Modal */}
          <BowelModal
            isVisible={isBowelModalVisible}
            onClose={() => setIsBowelModalVisible(false)}
          />

          {/* Wellness container */}
          <View style={styles.WellnessContainer}>
            <Text style={styles.logTitle}>Hvordan har du det idag?</Text>
            <View style={styles.emoticonContainer}>
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
          </View>

          {/* symptom container */}
          <View style={styles.symptomContainer}>
            <Text style={styles.logTitle}>Vælg dine symptomer</Text>
            {/* Map over symptomOptions and render Checkbox for each symptom */}
            {symptomOptions.map(({ label, value }) => (
              <Checkbox
                key={value} // Ensures each Checkbox has a unique key
                label={label} // Passes the symptom label
                value={value} // Passes the value of the symptom
                isChecked={selectedSymptoms.includes(value)} // Check if the symptom is selected
                onChange={(isChecked) => handleCheckboxChange(value, isChecked)} // Handle checkbox change
              />
            ))}
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
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",  
    padding: 5,
    marginTop: 25,
    marginBottom: 25,
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
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  foodContainer: {
    marginLeft: "10",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  foodContent: {},
  waterContainer: {
    marginLeft: "10",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "center",
  },
  waterContent: {
    alignItems: "center",
  },
  waterIntakeText: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 5,
    width: 140,
    textAlign: "center",
  },
  waterIconContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "34%",
    paddingHorizontal: 15,
  },
  bowelContainer: {
    backgroundColor: "grey",
    marginLeft: "10",
    width: "94%",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  bowelContent: {
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
    padding: 2,
  },
  emoticonContainer: {
    flexDirection: "row",
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
  logTitleContainer: {
    flexDirection: "row",
  },
  logTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
});
