import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { updatePassword } from "../../firebase/auth";
import { Entypo } from "@expo/vector-icons";
import CustomButton from "../CustomButton";

const ChangePasswordModal = ({ isVisible, closeModal }) => {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <Modal
      visible={isVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        {/* Close Button (X) */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Entypo name="cross" size={30} color="black" />
        </TouchableOpacity>

        {/* Modal Title */}
        <Text style={styles.modalTitle}>Skift password</Text>

        <View style={styles.buttonContainer}>
          {/* Cancel Button */}
          <CustomButton
            title="Annuller"
            handlePress={closeModal}
            customStyles={styles.cancelButton}
            textStyles={styles.buttonText}
          />
          {/* Add Food Button */}
          <CustomButton
            title="Skift password"
            customStyles={styles.addButton}
            textStyles={styles.buttonText}
            handlePress={() => {}}
          />
        </View>
      </View>
    </Modal>
  );
};

export default ChangePasswordModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    width: "95%",
    flex: 1,
    marginTop: "20%",
    alignSelf: "center",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Center the buttons horizontally
    alignItems: "center", // Align items in the row vertically
    position: "absolute",
    bottom: 20,
    width: "90%",
    gap: 10, // Add space between buttons
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  addButton: {
    backgroundColor: "green",
    paddingVertical: 8,
    alignItems: "center", // Center text inside the button
    justifyContent: "center",
    width: 100,
  },
  buttonText: {
    fontSize: 14, // Smaller font size
    color: "white",
    fontWeight: "600",
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
    height: 35,
  },
});