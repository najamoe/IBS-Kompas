import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Modal } from "react-native";
import RNPickerSelect from "react-native-picker-select";
import SearchField from "../searchfield";

const FoodModal = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleClose = () => {
    setModalVisible(false); // Close the modal
  };

  return (
    <Modal
      isVisible={modalVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="rgba(0, 0, 0, 0.6)"
      onBackdropPress={handleClose}
      onRequestClose={handleClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* Close Button (X) */}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Entypo name="cross" size={30} color="black" />
        </TouchableOpacity>

        {/* Modal Title */}
        <Text style={styles.modalTitle}>Tilføj mad</Text>

        <RNPickerSelect
          value={selectedType}
          useNativeAndroidPickerStyle={false}
          onValueChange={(value) => setSelectedType(value)}
          items={[
            { label: "Morgenmad", value: "breakfast" },
            { label: "Frokost", value: "lunch" },
            { label: "Aftensmad", value: "dinner" },
            { label: "Snack", value: "snack" },
          ]}
          placeholder={{ label: "Vælg måltidstype", value: null }}
          style={pickerSelectStyles}
        />

        <SearchField />
      </View>
    </Modal>
  );
};

export default FoodModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    width: "95%",
    flex: 1,
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
});

const pickerSelectStyles = StyleSheet.create({
  inputAndroid: {
    fontSize: 16,
    marginLeft: 10,
    color: "black",
    height: 35,
  },
});
