import React, { useState } from "react";
import { StyleSheet, Text, View, Modal } from "react-native";
import { updateUserPassword, reauthenticateUser } from "../../firebase/auth"; 
import CustomButton from "../CustomButton";
import FormField from "../FormField";
import  Toast  from "react-native-toast-message"; 

const UpdatePasswordModal = ({ user, visible, closeModal }) => {
const [loading, setLoading] = useState(false);
const [isSubmitting, setIsSubmitting] = useState(false);
const [currentPassword, setCurrentPassword] = useState("");
const [newPassword, setNewPassword] = useState("");
const [confirmPassword, setConfirmPassword] = useState("");

// Separate visibility states for each password field
const [showCurrentPassword, setShowCurrentPassword] = useState(false);
const [showNewPassword, setShowNewPassword] = useState(false);
const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Uoverensstemmelse",
        text2: "De nye passwords stemmer ikke overens",
        visibilityTime: 5000,
        position: "bottom",
      });
      return;
    }
    if (typeof newPassword !== "string" || newPassword.length < 6) {
      Toast.show({
        type: "error",
        text1: "Invalid Password",
        text2: "Det nye password skal være mindst 6 tegn langt",
        visibilityTime: 5000,
        position: "bottom",
      });
      return;
    }

    if(!currentPassword || !newPassword || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Udfyld alle felter",
        text2: "Udfyld venligst alle felter for at fortsætte",
        visibilityTime: 5000,
        position: "bottom",
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
        position: "bottom",
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
        position: "bottom",
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
    width: "60%",
    marginLeft: 10,
  },
  buttonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
});
