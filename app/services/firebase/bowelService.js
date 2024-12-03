import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import Modal from "react-native-modal"; 

const BowelModal = ({ isVisible, onClose, onAddWater }) => {
  const handleType = (type) => {
    onAddWater(type); // Pass the selected amount back to the parent
    onClose(); 
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="rgba(0, 0, 0, 0.6)"
      onBackdropPress={onClose}
      onRequestClose={onClose}
      style={styles.modal}
    >
      <View style={styles.modalContent}>
        <View style={styles.buttonsContainer}>
          {[
            { type: 1, image: require("../../../assets/images/bowel/type1.png") },
            { type: 2, image: require("../../../assets/images/bowel/type2.png") },
            { type: 3, image: require("../../../assets/images/bowel/type3.png") },
            { type: 4, image: require("../../../assets/images/bowel/type4.png") },
            { type: 4, image: require("../../../assets/images/bowel/type5.png") },
            { type: 4, image: require("../../../assets/images/bowel/type6.png") },
            { type: 4, image: require("../../../assets/images/bowel/type7.png") },
          ].map((option) => (
            <TouchableOpacity
              key={option.type}
              style={styles.button}
              onPress={() => handleType(option.type)}
            >
              <Image source={option.image} style={styles.image} />
              <Text style={styles.buttonText}>{option.type} liter</Text>
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
    borderRadius: 180, 
    alignItems: "center",
  },
  buttonsContainer: {
    marginTop: 8,
    flexDirection: "row", 
    flexWrap: "wrap",
    justifyContent: "center", 
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
    width: 30, 
    height: 30, 
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

export default BowelModal;
