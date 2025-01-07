import React, { useState } from "react";
import { StyleSheet, Text, View, Modal, Alert } from "react-native";
import { updateUserPassword, reauthenticateUser } from "../../firebase/auth";
import CustomButton from "../CustomButton";
import FormField from "../FormField";

const UpdatePasswordModal = ({ user, visible, closeModal }) => {
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // visibility states for each password field
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    console.log("Changing password...");

    // Validate form fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      console.log("All fields are required");
      Alert.alert("Fejl", "Alle felter skal udfyldes");
      return;
    }

    if (newPassword !== confirmPassword) {
      console.log("Passwords do not match");
      Alert.alert("Fejl", "De nye passwords stemmer ikke overens");
      return;
    }

    if (newPassword.length < 6) {
      console.log("Password must be at least 6 characters long");
      Alert.alert("Fejl", "Password skal være mindst 6 tegn langt");
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
      Alert.alert("Success", "Password opdateret");

      // Close modal on success
      closeModal();
    } catch (error) {
      console.error("Error updating password:", error.message);
      Alert.alert("Fejl", "Kunne ikke opdatere password");
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
            title="Password"
            placeholder="Indtast nuværende password"
            value={currentPassword}
            handleChangeText={setCurrentPassword}
            showPassword={showCurrentPassword}
            setShowPassword={setShowCurrentPassword}
            otherStyles={styles.customField}
          />

          <FormField
            title="Password"
            placeholder="Indtast nyt password"
            value={newPassword}
            handleChangeText={setNewPassword}
            showPassword={showNewPassword}
            setShowPassword={setShowNewPassword}
            otherStyles={styles.customField}
          />

          <FormField
            title="Verificér Password"
            placeholder="Bekræft nyt password"
            value={confirmPassword}
            handleChangeText={setConfirmPassword}
            showPassword={showConfirmPassword}
            setShowPassword={setShowConfirmPassword}
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
              title={loading ? "Opdaterer..." : "Opdater password"}
              customStyles={styles.addButton}
              textStyles={styles.buttonText}
              handlePress={handleChangePassword}
              isLoading={isSubmitting}
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
  },
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%", 
    maxWidth: 400, 
  },
  customField: {
    marginTop: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 20,
    textAlign: "center", 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
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
    width: "60%",
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
});
