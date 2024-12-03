import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Button,
} from "react-native";
import Modal from "react-native-modal";

const BowelModal = ({ isVisible, onClose }) => {
    const formatDate = () => {
        const currentDate = new Date();
        const day = currentDate.getDate().toString().padStart(2, "0");
        const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
        const year = currentDate.getFullYear();
        return `${day}-${month}-${year}`;
      };
    
      const currentDate = formatDate(); 
    

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
      <View style={styles.container}>
        <Text style={styles.modalTitle}>Bowel Modal Content</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.dateText}>{currentDate}</Text>
        </View>
    

      

        {/* Buttons for saving or canceling */}
        <View style={styles.exitButtonContainer}>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.exitButton}>Afbryd</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.saveButton}>Gem</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default BowelModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "#ececeb",
    width: "95%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
  },
  dateTimeContainer: {
    borderColor: "black",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 5,
    marginTop: 15,
    width: 140,
    alignItems: "center",
  },  
  dateText: {
    fontSize: 24,
    fontWeight: "300",

  
  },
  saveButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  exitButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  exitButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
    color: "blue",
    fontWeight: "bold",
  },
});
