import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { updateUserPassword } from "../../firebase/auth"; // Ensure this is correctly imported
import { Entypo } from "@expo/vector-icons";
import CustomButton from "../CustomButton";
import FormField from "../FormField";
import { Toast } from "react-native-toast-message"; // Assuming you're using this for notifications

const UpdatePasswordModal = ({ user, visible, closeModal }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Uoverensstemmelse",
        text2: "De nye passwords stemmer ikke overens",
        visibilityTime: 5000,
        position: "top",
      });
      return;
    }

    try {
      // Call Firebase updatePassword
      await updateUserPassword(user, newPassword);

      // Show success message
      Toast.show({
        type: "success",
        text1: "Password opdateret",
        text2: "Dit password er opdateret",
        visibilityTime: 5000,
        position: "top",
      });

      // Close modal on success
      closeModal();
    } catch (error) {
      console.error("Error updating password:", error.message);
      Toast.show({
        type: "error",
        text1: "Opdatering mislykkedes",
        text2: error.message,
        visibilityTime: 5000,
        position: "top",
      });
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true} // Make the modal transparent
      onRequestClose={closeModal}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.container}>
          {/* Modal Title */}
          <Text style={styles.modalTitle}>Skift password</Text>

          {/* Form Fields */}
          <FormField
            label="Nuværende password"
            placeholder="Indtast nuværende password"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            otherStyles={styles.customField}
          />
          <FormField
            label="Nyt password"
            placeholder="Indtast nyt password"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            otherStyles={styles.customField}
          />
          <FormField
            label="Bekræft nyt password"
            placeholder="Bekræft nyt password"
            secureTextEntry={true}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            otherStyles={styles.customField}
          />

          <View style={styles.buttonContainer}>
            {/* Cancel Button */}
            <CustomButton
              title="Annuller"
              handlePress={() => {
                closeModal();
              }}
              customStyles={styles.cancelButton}
              textStyles={styles.buttonText}
            />
            {/* Change Password Button */}
            <CustomButton
              title="Skift password"
              customStyles={styles.addButton}
              textStyles={styles.buttonText}
              handlePress={handleChangePassword}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default UpdatePasswordModal;

const styles = StyleSheet.create({
  modalBackdrop: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slightly darker background to dim the rest of the screen
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%", // Control the width of the modal
    maxWidth: 400, // Prevent it from being too wide on larger screens
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 20,
    textAlign: "center", // Ensure title is centered
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between", // Distribute buttons evenly
    alignItems: "center",
    marginTop: 20,
  },
  cancelButton: {
    backgroundColor: "red",
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    width: 100,
  },
  addButton: {
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
    width: "50%",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
});
