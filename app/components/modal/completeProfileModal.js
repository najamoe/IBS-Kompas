import { StyleSheet, Text, View, Modal } from "react-native";
import React from "react";
import { router } from "expo-router";
import CustomButton from "../CustomButton";
import { checkCompletedProfile } from "../../utility/profileUtils"; // Assuming this checks the profile

const CompleteProfileModal = ({
  userData,
  setUserData,
  setModalVisible,
  modalVisible,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
    >
      <View style={styles.modalOverlay}>
      <View style={styles.container}>
        <Text style={styles.titleText}> Færdiggør din profil </Text>
        <View style={styles.contentContainer}>
        <Text style={styles.modalText}>
          For at få den bedste oplevelse med appen, anbefaler vi at du udfylder
          din profil.
        </Text>
        <Text style={styles.modalText}>
          Du kan altid springe dette trin over og udfylde din profil senere.
        </Text>
        <Text style={styles.modalText}>
          Ønsker du at færdiggøre din profil nu?
        </Text>

        <View style={styles.buttonContainer}>
           <CustomButton
            title="Spring over"
            customStyles={styles.skipButton}
            handlePress={() => {
              setModalVisible(false);
            }}
          />
          <CustomButton
            title="Færdiggør Profil"
            customStyles={styles.finishButton}
            handlePress={() => {
              // Calling the imported function to check if the profile is complete
              checkCompletedProfile(userData, setUserData);
              setModalVisible(false);
              router.replace("/profile");
            }}
          />
         
          </View>
        </View>
      </View>
      </View>
    </Modal>
  );
};

export default CompleteProfileModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    marginTop: 60,
    marginHorizontal: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    borderColor: "#86C5D8",
    borderWidth: 1.5,
  },
  contentContainer: {
    alignItems: "center",
  },
  titleText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  finishButton: {
    width: 140,
  },
  skipButton: {
    backgroundColor: "red",
    width: 140,
  },
});
