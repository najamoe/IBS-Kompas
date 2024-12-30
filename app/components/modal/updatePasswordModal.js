import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import { updateUserPassword } from "../../firebase/auth"; // Ensure this is correctly imported
import { Entypo } from "@expo/vector-icons";
import CustomButton from "../CustomButton";
import FormField from "../FormField";
import { Toast } from "react-native-toast-message"; // Assuming you're using this for notifications

const UpdatePasswordModal = ({ isVisible, closeModal, user }) => {
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
      visible={isVisible}
      animationType="fade"
      transparent={false}
      onRequestClose={closeModal}
    >
      <View style={styles.container}>
        {/* Close Button (X) */}
        <TouchableOpacity onPress={closeModal} style={styles.closeButton}>
          <Entypo name="cross" size={30} color="black" />
        </TouchableOpacity>

        {/* Modal Title */}
        <Text style={styles.modalTitle}>Skift password</Text>

        {/* Form Fields */}
        <FormField
          label="Nuværende password"
          placeholder="Indtast nuværende password"
          secureTextEntry={true}
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
        <FormField
          label="Nyt password"
          placeholder="Indtast nyt password"
          secureTextEntry={true}
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <FormField
          label="Bekræft nyt password"
          placeholder="Bekræft nyt password"
          secureTextEntry={true}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <View style={styles.buttonContainer}>
          {/* Cancel Button */}
          <CustomButton
            title="Annuller"
            handlePress={closeModal}
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
    </Modal>
  );
};

export default UpdatePasswordModal;

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
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 20,
    width: "90%",
    gap: 10,
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
    width: "40%",
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
});
