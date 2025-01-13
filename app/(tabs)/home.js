import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { AntDesign } from "@expo/vector-icons";
import { fetchUserDetails } from "../services/firebase/userService";
import CompleteProfileModal from "../components/modal/completeProfileModal";
import FoodDisplay from "../components/displays/foodDisplay";
import SymptomDisplay from "../components/displays/symptomDisplay";
import BowelDisplay from "../components/displays/bowelDisplay";
import WaterDisplay from "../components/displays/waterDisplay";
import WellnessDisplay from "../components/displays/wellnessDisplay";

const TAB_BAR_HEIGHT = 60;

const Home = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);

  // Check if the user is signed in & fetch data to see if the profile is completed
  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const currentUser = auth.currentUser;

        if (currentUser) {
          // Fetch user details using the uid
          const fetchedUserData = await fetchUserDetails(currentUser.uid);

          if (fetchedUserData) {
            setUserData(fetchedUserData);

            // Display modal if the profile is not completed
            if (fetchedUserData.profileCompleted === false) {
              setModalVisible(true);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchData();
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
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { paddingBottom: TAB_BAR_HEIGHT + 10 },
        ]}
      >
        <View style={styles.dateContainer}>
          {/* Header with date navigation */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => handleDayChange(-1)}>
              <AntDesign style={styles.arrowIcons} name="left" size={22} />
            </TouchableOpacity>
            <Text style={styles.dateText}>
              {formatDateDisplay(selectedDate)}
            </Text>
            <TouchableOpacity onPress={() => handleDayChange(1)}>
              <AntDesign style={styles.arrowIcons} name="right" size={22} />
            </TouchableOpacity>
          </View>
        </View>

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

        <SymptomDisplay
          user={user}
          selectedDate={selectedDate}
          symptoms={symptoms}
          setSymptoms={setSymptoms}
        />

        <CompleteProfileModal
          modalVisible={modalVisible} // Modal displayed if profile is not completed
          setModalVisible={setModalVisible} // Function to set modal visibility
          userData={userData}
          setUserData={setUserData}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#cae9f5",
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
  arrowIcons: {
    margin: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: 600,
  },
  foodContainer: {
    width: "96%",
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
