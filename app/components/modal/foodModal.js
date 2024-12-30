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
import { addFoodIntake } from "../../services/firebase/foodService";

const FoodModal = ({ modalVisible, setModalVisible, userId }) => {
  const [selectedType, setSelectedType] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState(null);
  const [foodName, setFoodName] = useState("");



  // Reset when modalVisibility changes
  useEffect(() => {
    if (!modalVisible) {
      setSelectedType(null);
      setQuantity("");
      setUnit(null);
      setFoodName("");
    }
  }, [modalVisible]);

  // Function to handle updating selected items from SearchField
  const updateSelectedItems = (items) => {
    setSelectedItems(items); // Update the state with selected items
  };

  // Update the food name when a food item is selected
  const handleFoodSelect = (item) => {
    setFoodName(item.name); // Update foodName with the selected item's name
  };

  const handleSaveFood = async () => {
    if (!selectedItems || selectedItems.length === 0) {
      alert("Ingen mad valgt."); // Shows an alert if no food is selected
      return;
    }
    if (!selectedType) {
      alert("Vælg venligst en måltidstype."); // Shows an alert if no meal type is selected
      return;
    }

    try {
      for (const item of selectedItems) {
        const foodData = {
          name: item.name,
          brand: item.brand,
          quantity: `${item.quantity} ${item.unit}`,
        };

        await addFoodIntake(userId, foodData, selectedType);

      }
      setModalVisible(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving food items:", error);
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
            onValueChange={(value) => {
              console.log("Selected Type:", value); // Log the selected value
              setSelectedType(value);
            }}
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
              userId={userId} // Pass userId to SearchField
              foodName={foodName} // Bind the state for food name
              setFoodName={setFoodName} // Pass the setter for food name
              onFoodSelect={handleFoodSelect}
              selectedItems={selectedItems}
              setSelectedItems={updateSelectedItems} // Handle selected food
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
    justifyContent: "space-between", // Add this to distribute space
    width: "90%",
    height: "90%",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 10,
    marginBottom: 20,
  },
  searchContainer: {
    width: "100%",
    marginBottom: 15,
    marginTop: 40,
    marginBottom: 50,
  },
  saveandbackbtn: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%", // Ensure the buttons take full width
    marginTop: "auto",
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
      width: 140,
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
      width: 140,
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
      width: 80,
    },
    inputAndroid: {
      fontSize: 14,
      paddingHorizontal: 8,
      paddingVertical: 8,
      borderWidth: 0.5,
      borderColor: "#cfc9c8",
      borderRadius: 8,
      backgroundColor: "#ffffff",
      width: 80,
    },
  },
});
