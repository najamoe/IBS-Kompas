import React, { useState, useEffect, useCallback, useRef } from "react";
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
import Ionicons from "react-native-vector-icons/Ionicons";
import { AntDesign } from "@expo/vector-icons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FoodDisplay from "../components/displays/foodDisplay";
import {
  addWaterIntake,
  fetchWaterIntake,
  removeWaterIntake,
} from "../services/firebase/waterService";
import WaterModal from "../components/modal/waterModal";
import BowelModal from "../components/modal/bowelModal";
import { fetchBowelLog } from "../services/firebase/bowelService";
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
  const [bowelStep, setBowelStep] = useState(1);
  const [bowelLogs, setBowelLogs] = useState([]);
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
      const fetchData = async () => {
        try {
          // Fetch water intake

          const intake = await fetchWaterIntake(user.uid, selectedDate);
          setWaterIntake(intake);

          // Fetch wellness log

          const wellnesslog = await fetchWellnessLog(user.uid, selectedDate);
          setSelectedMood(wellnesslog || null);

          // Fetch logged symptoms for the selected date

          const symptoms = await fetchSymptoms(user.uid, selectedDate);
          setSymptoms(symptoms);

          // Fetch bowel logs for the selected date

          const bowelLogData = await fetchBowelLog(user.uid, selectedDate);
          setBowelLogs(bowelLogData || []);
        } catch (error) {
          console.error("Error fetching data from home.js:", error); //LOGS
        }
      };
      fetchData();
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
        //Insert error handling
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
        //Insert error handling
      }
    } else {
      alert("Please sign in to remove water intake.");
    }
  };

  const emoticons = [
    { name: "emoticon-excited-outline", color: "#006147" },
    { name: "emoticon-outline", color: "#03a137" },
    { name: "emoticon-happy-outline", color: "#4CAF50" },
    { name: "emoticon-neutral-outline", color: "#3228ed" },
    { name: "emoticon-sad-outline", color: "#ed8505" },
    { name: "emoticon-cry-outline", color: "#a65c02" },
    { name: "emoticon-sick-outline", color: "#F44336" },
  ];

  const handleEmoticonPress = async (emoticon) => {
    if (!user) {
      //Insert error handling
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
    { label: "halsbrand", value: "halsbrand" },
    { label: "feber", value: "feber" },
    { label: "forstoppelse", value: "forstoppelse" },
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
        //Insert error handling
      }
    }
  };

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    // Fetch data again when pulling to refresh
    const fetchData = async () => {
      if (user) {
        try {
          // Fetch the same data you load in useEffect
          await fetchData();
        } catch (error) {
          console.error("Error refreshing data:", error);
        }
      }
    };

    setRefreshing(false);
  }, [user, selectedDate]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={{ flex: 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
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

        <View style={styles.waterContainer}>
          <View style={styles.logTitleContainer}>
            <Text style={styles.logTitle}>Tilføj væskeindtag</Text>
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
            <Text style={styles.logTitle}>Log toiletbesøg</Text>
          </View>

          <View style={styles.bowelContent}>
            {bowelLogs.length > 0 ? (
              bowelLogs.map((log) => (
                <View key={log.id} style={styles.bowelLogItem}>
                  <MaterialCommunityIcons
                    name="emoticon-poop"
                    size={30}
                    color="#8c4c1f"
                  />
                </View>
              ))
            ) : (
              <Text>No bowel logs found for this user.</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={() => {
              setIsBowelModalVisible(true);
              setBowelStep(1);
            }}
          >
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
                  size={selectedMood === icon.name ? 38 : 30} // Increase size if selected
                  color={selectedMood === icon.name ? "white" : icon.color}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* symptom container */}
        <View style={styles.symptomContainer}>
          <Text style={styles.logTitle}>Vælg dine symptomer</Text>
          <View style={styles.symptomListContainer}>
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
        </View>

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
    marginLeft: 20,
    width: "90%",
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
  waterContainer: {
    marginLeft: 20,
    width: "90%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "center",
    elevation: 10,
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
    borderRadius: 50,
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
    marginLeft: 20,
    backgroundColor: "white",
    width: "90%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    alignItems: "center",
    elevation: 10,
  },
  bowelContent: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  addBowel: {
    fontSize: 16,
    fontWeight: "500",
    borderColor: "black",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 50,
    width: 120,
    textAlign: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  bowelLogItem: {
    margin: 6,
  },
  WellnessContainer: {
    marginLeft: 20,
    width: "90%",
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
  symptomContainer: {
    marginLeft: 20,
    width: "90%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    marginBottom: 100,
    backgroundColor: "white",
    alignItems: "center",
    elevation: 10,
  },
  symptomListContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
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
