import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";

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

        {/* Swiper for paginated pages */}
        <Swiper
          style={styles.swiper}
          showsPagination={true}
          loop={false}
          scrollEnabled={true} // Enable scrolling/swiping
        >
          <View style={styles.page}>
            <Text style={styles.dateText}>{currentDate}</Text>

            
          </View>

          <View style={styles.page}>
            <Text style={styles.pageText}>Second Page Content</Text>
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

          <View style={styles.page}>
            <Text style={styles.pageText}>Third Page Content</Text>
          </View>
        </Swiper>
      </View>
    </Modal>
  );
};

export default BowelModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1, // Ensure the modal takes up the full screen
  },
  container: {
    backgroundColor: "white",
    opacity: 0.9,
    width: "95%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1, // Allow the swiper to take up the remaining space
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
  },
  dateText: {
    fontSize: 24,
    fontWeight: "300",
  },
  swiper: {
    width: "100%",
    height: 250,
    marginTop: 15,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  pageText: {
    fontSize: 20,
    textAlign: "center",
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
  },
});
