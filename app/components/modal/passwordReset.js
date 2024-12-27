// components/ResetPasswordModal.js
import React from "react";
import { Modal, View, Text, StyleSheet } from "react-native";
import CustomButton from "../CustomButton";
import FormField from "../FormField";

const ResetPasswordModal = ({
  modalVisible,
  setModalVisible,
  handlePasswordReset,
  resetEmail,
  setResetEmail,
}) => {
  return (
    <Modal
      visible={modalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Nulstil password</Text>

          <FormField
            customStyles={styles.CustomInputStyle}
            title=""
            placeholder="Indtast din email"
            value={resetEmail}
            handleChangeText={setResetEmail}
            keyboardType="email-address"
          />

          <View style={styles.buttonContainer}>
            <CustomButton
              title="Afbryd"
              customStyles={[styles.modalButtonStyle, { backgroundColor: "#a60202" }]}
              textStyles={styles.buttonTextStyle}
              handlePress={() => setModalVisible(false)}
              style={styles.cancelButton}
            />

            <CustomButton
              title="Nulstil"
              customStyles={[styles.modalButtonStyle]}
              textStyles={styles.buttonTextStyle}
              handlePress={handlePasswordReset}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "gray",
  },
  buttonContainer: {
    flexDirection: "row",
  },
  modalButtonStyle: {
    height: 40,
    width: 90,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontSize: 14,
  },
  CustomInputStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
});

export default ResetPasswordModal;
