import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";

import { signOutUser, deleteUserAccount } from "../firebase/auth";
import CustomButton from "../components/CustomButton";
import firebaseConfig from "../firebase/FirebaseConfig";
import { fetchUserDetails, updateUserDetails } from "../firebase/firestoreService"; // Add updateUserDetails function

const { auth } = firebaseConfig;

const Profile = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [date, setDate] = useState(new Date());
  const [pickerVisible, setPickerVisible] = useState(false);

  useEffect(() => {
    const getUserData = async () => {
      const user = auth.currentUser;
      if (!user) {
        console.error("No authenticated user.");
        setLoading(false);
        return;
      }
      try {
        const data = await fetchUserDetails(user.uid);
        setUserData(data);
        if (data.birthday) setDate(new Date(data.birthday)); // Preload the date picker
      } catch (error) {
        console.error("Error fetching user details:", error);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const getUserField = (field) => {
    return userData && userData[field] ? userData[field] : "Ikke indtastet";
  };

  const handleDeleteUser = async () => {
    try {
      console.log("Delete account function triggered");
      await deleteUserAccount();
      setModalVisible(false);
    } catch (error) {
      console.error("Something went wrong with account deletion", error);
    }
  };
  const formatDateToDDMMYYYY = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const saveBirthdayToFirestore = async (selectedDate) => {
    const user = auth.currentUser;
    if (!user) return;
  
    const formattedDate = formatDateToDDMMYYYY(selectedDate);
  
    try {
      await updateUserDetails(user.uid, { birthday: formattedDate });
      setUserData((prevData) => ({
        ...prevData,
        birthday: formattedDate,
      }));
      console.log("Birthday updated successfully!");
    } catch (error) {
      console.error("Error updating birthday in Firestore:", error);
    }
  };
  

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View style={styles.container}>
            <View style={styles.profileContainer}>
              <Text style={styles.profileText}>
                Name: {loading ? "Henter navn..." : getUserField("name")}
              </Text>

              <Text style={styles.profileText}>
                Email: {loading ? "Henter email..." : getUserField("email")}
              </Text>

              <Text style={styles.profileText}>
                Fødselsdato:{" "}
                {loading ? "Henter Fødselsdato..." : getUserField("birthday")}
                {"  "}
                <TouchableOpacity onPress={() => setPickerVisible(true)}>
                  <FontAwesomeIcon icon={faPenToSquare} size={20} color="#000" />
                </TouchableOpacity>
              </Text>

              {pickerVisible && (
                <DateTimePicker
                  value={date}
                  mode="date"
                  display="spinner"
                  onChange={(event, selectedDate) => {
                    if (selectedDate) {
                      setPickerVisible(false);
                      setDate(selectedDate);
                      saveBirthdayToFirestore(selectedDate);
                    } else {
                      setPickerVisible(false);
                    }
                  }}
                />
              )}
            </View>

            <CustomButton
              title="Sign Out"
              style={styles.signOutButton}
              handlePress={() => {
                console.log("Sign Out button pressed");
                signOutUser();
              }}
            />
            <CustomButton
              title="Slet konto"
              style={styles.DeleteButton}
              handlePress={() => {
                console.log("Delete account button pressed");
                setModalVisible(true);
              }}
              iconName="trash"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainerDelete}>
          <View style={styles.modalContentDelete}>
            <Text style={styles.modalTitleDelete}>Slet konto</Text>
            <Text>Er du sikker på du ønsker at slette din konto?</Text>
            <Text>Handlingen kan ikke fortrydes</Text>
            <CustomButton
              title="Ja, slet konto"
              handlePress={handleDeleteUser}
            />
            <CustomButton
              title="Nej, slet ikke min konto"
              handlePress={() => {
                console.log("Cancel button pressed");
                setModalVisible(false);
              }}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: { flex: 1 },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  profileContainer: {
    backgroundColor: "white",
  },
  modalContainerDelete: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContentDelete: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitleDelete: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 1,
  },
  cancelButton: {
    marginTop: 1,
    backgroundColor: "gray",
  },
});
