import React, { useState, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";
import RNPickerSelect from "react-native-picker-select";
import SearchField from "../searchfield";

const FoodModal = ({ modalVisible, setModalVisible, userId }) => {
  const [selectedType, setSelectedType] = useState(null); // Picker state
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(null);
  const [foodName, setFoodName] = useState("");

  // Reset the state when modalVisibility changes
  useEffect(() => {
    if (!modalVisible) {
      setSelectedType(null);
      setQuantity("");
      setUnit(null);
      setFoodName("");
    }
  }, [modalVisible]);

  const handleSaveFood = async () => {
    if (!selectedType || !foodName || !quantity || !unit) {
      console.error("All fields are required!");
      return;
    }

    const foodData = {
      name: foodName,
      quantity: `${quantity} ${unit}`,
    };

    try {
      await addFoodIntake(userId, foodData, selectedType); // Save food intake
      console.log("Food item saved successfully!");
      setModalVisible(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving food item:", error);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleBackdropPress = (e) => {
    if (e.target === e.currentTarget) {
      setModalVisible(false);
    }
  };

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={handleClose}
      pointerEvents="box-none"
    >
      <View style={styles.modalOverlay} onTouchStart={handleBackdropPress}>
        <View style={styles.container}>
          <Text style={styles.modalTitle}>Tilføj mad</Text>

          {/* Picker for selecting meal type */}
          <RNPickerSelect
            useNativeAndroidPickerStyle={false}
            value={selectedType}
            onValueChange={(value) => setSelectedType(value)}
            items={[
              { label: "Morgenmad", value: "breakfast" },
              { label: "Frokost", value: "lunch" },
              { label: "Aftensmad", value: "dinner" },
              { label: "Snack", value: "snack" },
            ]}
            placeholder={{ label: "Vælg måltidstype", value: null }}
            style={pickerSelectStyles.selectedType}
          />

          {/* Search field for food name */}
          <View style={styles.searchContainer}>
            <SearchField
              placeholder="Søg mad"
              value={foodName}
              onChangeText={(text) => setFoodName(text)}
            />
          </View>

          {/* Input fields for quantity and unit */}
          <View style={styles.quantityContainer}>
            <TextInput
              style={styles.quantityInput}
              placeholder="Mængde"
              keyboardType="numeric"
              value={quantity}
              onChangeText={(text) => setQuantity(text)}
            />
            <RNPickerSelect
              useNativeAndroidPickerStyle={false}
              value={unit}
              onValueChange={(value) => setUnit(value)}
              items={[
                { label: "ml", value: "ml" },
                { label: "L", value: "L" },
                { label: "gram", value: "gram" },
                { label: "kg", value: "kg" },
              ]}
              placeholder={{ label: "Enhed", value: null }}
              style={pickerSelectStyles.unit}
            />
          </View>

          {/* Save and back buttons */}
          <View style={styles.saveandbackbtn}>
            <TouchableOpacity onPress={handleClose} style={styles.backButton}>
              <Text style={styles.backButtonText}>Tilbage</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSaveFood}
              style={styles.saveButton}
            >
              <Text style={styles.saveButtonText}>Tilføj</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FoodModal;

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    justifyContent: "flex-start",
    width: "90%",
    height: "70%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 10,
  },
  searchContainer: {
    width: "100%",
    marginBottom: 15,
    marginTop: 50,
    marginBottom: 50,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
    backgroundColor: "#ffffff",
    width: "50%",
  },
  quantityInput: {
    marginRight: 10,
    borderWidth: 0.5,
    borderColor: "#cfc9c8",
    borderRadius: 8,
    height: 35,
  },
  saveandbackbtn: {
    flexDirection: "row",
    marginTop: 30,
  },
  saveButton: {
    backgroundColor: "#86C5D8",
    padding: 15,
    borderRadius: 25,
    marginLeft: 10,
    width: "30%",
  },
  saveButtonText: {
    color: "white",
    fontWeight: "600",
    textAlign: "center",
  },
  backButton: {
    backgroundColor: "grey",
    padding: 15,
    borderRadius: 25,
    width: "30%",
  },
  backButtonText: {
    color: "white",
    fontWeight: "400",
    textAlign: "center",
  },
});

const pickerSelectStyles = StyleSheet.create({
  selectedType: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#cfc9c8",
      borderRadius: 4,
      color: "black",
      paddingRight: 40,
      backgroundColor: "#ffffff",
      width: "100%",
      marginTop: 20,
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 10,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "#cfc9c8",
      borderRadius: 8,
      color: "black",
      backgroundColor: "#ffffff",
      width: "100%",
    },
  },
  unit: {
    inputIOS: {
      fontSize: 16,
      paddingVertical: 12,
      paddingHorizontal: 10,
      borderWidth: 1,
      borderColor: "#cfc9c8",
      borderRadius: 4,
      backgroundColor: "#fff3e0",
      width: "35%",
    },
    inputAndroid: {
      fontSize: 16,
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "#cfc9c8",
      borderRadius: 8,
      backgroundColor: "#ffffff",
    },
  },
});
