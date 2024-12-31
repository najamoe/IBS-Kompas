import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { updateUserPassword, reauthenticateUser } from "../../firebase/auth"; // Ensure this is correctly imported
import { Entypo } from "@expo/vector-icons";
import CustomButton from "../CustomButton";
import FormField from "../FormField";
import  Toast  from "react-native-toast-message"; // Assuming you're using this for notifications

const UpdatePasswordModal = ({ user, visible, closeModal }) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    console.log("Changing password...", newPassword);
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
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2: "Det nye password skal være mindst 6 tegn langt",
        visibilityTime: 5000,
        position: "top",
      });
      return;
    }


    try {
      // Step 1: Reauthenticate user
      console.log("Reauthenticating...");
      await reauthenticateUser(user, currentPassword);

      // Step 2: Update password
      console.log("Updating password...");
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
      transparent={true} 
      onRequestClose={closeModal}
    >
      <View style={styles.modalBackdrop}>
        <View style={styles.container}>
          {/* Modal Title */}
          <Text style={styles.modalTitle}>Skift password</Text>

          {/* Form Fields */}
          <FormField
          title={"Password"}
            label="Nuværende password"
            placeholder="Indtast nuværende password"
            secureTextEntry={true}
            value={currentPassword}
            onChangeText={setCurrentPassword}
            otherStyles={styles.customField}
          />
          <FormField
            title={"Password"}
            label="Nyt password"
            placeholder="Indtast nyt password"
            secureTextEntry={true}
            value={newPassword}
            onChangeText={setNewPassword}
            otherStyles={styles.customField}
          />
          <FormField
          title={"Verificér Password"}
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
  customField: {
    marginTop: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 20,
    textAlign: "center", // Ensure title is centered
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center", // Distribute buttons evenly
    alignItems: "center",
    margin: 10,
  },
  cancelButton: {
    backgroundColor: "#ba342b",
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
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
});
