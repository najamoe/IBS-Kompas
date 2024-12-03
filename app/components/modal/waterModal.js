import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal"; // Import react-native-modal

const WaterModal = ({ isVisible, onClose, onAddWater }) => {
  const handleAddAmount = (amount) => {
    onAddWater(amount); // Pass the selected amount back to the parent
    onClose(); // Close the modal after selection
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="rgba(0, 0, 0, 0.6)"
      onBackdropPress={onClose}
      onRequestClose={onClose}
      style={styles.modal} // Apply centering style to Modal
    >
      <View style={styles.modalContent}>
        <View style={styles.buttonsContainer}>
          {[
            { amount: 1, image: require("../../../assets/images/waterxlarge.png") },
            { amount: 0.75, image: require("../../../assets/images/waterlarge.png") },
            { amount: 0.5, image: require("../../../assets/images/watermedium.png") },
            { amount: 0.25, image: require("../../../assets/images/watersmall.png") }
          ].map((option) => (
            <TouchableOpacity
              key={option.amount}
              style={styles.button}
              onPress={() => handleAddAmount(option.amount)}
            >
              <Image source={option.image} style={styles.image} />
              <Text style={styles.buttonText}>{option.amount} liter</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center", 
    alignItems: "center", 
  },
  modalContent: {
    width: 250,
    height: 250,
    padding: 20,
    backgroundColor: "white",
    borderRadius: 180, // Rounded corners
    alignItems: "center",
  },
  buttonsContainer: {
    marginTop: 8,
    flexDirection: "row", // Arrange the buttons horizontally
    flexWrap: "wrap", // Allow wrapping if necessary
    justifyContent: "center", // Center the buttons
  },
  button: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    marginHorizontal: 5,
    width: 95,
    alignItems: "center",
  },
  buttonText: {
    color: "black",
    fontSize: 14,
    marginTop: 10,
  },
  image: {
    width: 30, // Adjust image size as needed
    height: 30, // Adjust image size as needed
  },
  closeButton: {
    backgroundColor: "#f44336",
    padding: 5,
    borderRadius: 10,
    marginTop: 20,
    width: "25%",
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 14,
  },
});

export default WaterModal;
