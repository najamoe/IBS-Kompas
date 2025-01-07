import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import CustomButton from "../CustomButton";

const ConfirmDeleteModal = ({ isVisible, onConfirm, onCancel }) => {
  if (!isVisible) return null;

  return (
    <Modal transparent={true} animationType="fade" visible={isVisible}>
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={onCancel} // Close modal when background is pressed
      >
        <TouchableOpacity
          style={styles.modalContent}
          activeOpacity={1} // Prevent click-through on the modal content
        >
          <Text style={styles.modalText}>
            Er du sikker på, at du vil slette?
          </Text>
          <View style={styles.buttonContainer}>
            <CustomButton
              title="Nej"
              handlePress={onCancel}
              customStyles={styles.cancelButton}
              textStyles={styles.buttonText}
            />
            <CustomButton
              title="Ja"
              handlePress={onConfirm}
              customStyles={styles.confirmButton}
              textStyles={styles.buttonText}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

export default ConfirmDeleteModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalText: {
    fontSize: 18,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  confirmButton: {
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
    width: 100,
    marginRight: 20,
  },
  cancelButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    width: 100,
    marginLeft: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    marginLeft: 0,
  },
});


