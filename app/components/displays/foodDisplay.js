import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { AntDesign } from "@expo/vector-icons";
import CustomButton from "../CustomButton";
import ConfirmDeleteModal from "../modal/confirmDeleteModal";
import FoodModal from "../modal/foodModal";
import {
  subscribeFood,
  deleteFoodIntake,
  updateFoodItem,
} from "../../services/firebase/foodService";

const FoodDisplay = ({ type, user, selectedDate }) => {
  const [foodData, setFoodData] = useState([]);
  const [isFoodModalVisible, setIsFoodModalVisible] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [selectedType, setSelectedType] = useState(type);
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          // Subscribe to real-time updates
          const unsubscribe = subscribeFood(
            user.uid,
            selectedDate,
            type,
            (fetchedFood) => {
              setFoodData(Array.isArray(fetchedFood) ? fetchedFood : []);
            }
          );

          // Cleanup subscription when component unmounts or dependencies change
          return () => unsubscribe();
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };

    fetchData();
  }, [user, selectedDate, selectedType]);

  const openFoodModal = () => {
    setSelectedType(type);
    setIsFoodModalVisible(true);
  };

  const confirmDeleteItem = (item) => {
    setItemToDelete(item);
    setIsDeleteModalVisible(true);
  };

const handleDeleteItem = async () => {
  try {
    if (itemToDelete) {
      // removing item from UI by matching timestamp
      setFoodData((prevFoodData) =>
        prevFoodData.filter(
          (foodItem) =>
            foodItem.timestamp !== itemToDelete.timestamp
        )
      );
      // Perform the actual deletion from Firestore
      await deleteFoodIntake(user.uid, itemToDelete, type);

      // Close the modal and reset item to delete
      setIsDeleteModalVisible(false);
      setItemToDelete(null);
    }
  } catch (error) {
    console.error("Error deleting food item:", error);

    // Revert the UI update on error
    setFoodData((prevFoodData) => [
      ...prevFoodData, 
    ]);
    setIsDeleteModalVisible(false);
  }
};



  const handleUpdateItem = async () => {
    try {
      if (selectedItem) {
        if (!quantity || isNaN(quantity) || quantity <= 0 || !unit) {
          Alert.alert("Fejl", "Der er noget galt med mængden eller enheden.");
          return;
        }

        const updatedItem = {
          ...selectedItem,
          quantity: quantity,
          unit: unit,
        };
        console.log(selectedItem, quantity, unit);


        await updateFoodItem(
          user.uid,
          selectedItem.id,
          updatedItem,
          type,
          selectedDate
        );

        setFoodData((prevFoodData) =>
          prevFoodData.map((item) =>
            item.id === selectedItem.id ? updatedItem : item
          )
        );

        // Reset form fields
        setItemName("");
        setQuantity("");
        setUnit("");

        setShowUpdateModal(false);
      }
    } catch (error) {
      console.error("Error updating food item:", error);
      Alert.alert(
        "Opdatering mislykkedes",
        "Der skete en fejl under opdatering af maden."
      );
      setShowUpdateModal(false);
    }
  };


  const handleCloseModal = () => {
    setShowUpdateModal(false);
    setSelectedItems([]); // Clear selected items
    setItemName(""); // Reset item name
    setQuantity(""); // Reset quantity
    setUnit(""); // Reset unit
  };

  const mealTypeLabels = {
    breakfast: "Morgenmad",
    lunch: "Frokost",
    dinner: "Aftensmad",
    snack: "Snack",
  };

  return (
    <View style={styles.foodContainer}>
      <View style={styles.titleContainer}>
        <Text style={styles.mealTypeTitle}>{mealTypeLabels[type]}</Text>
        <TouchableOpacity onPress={openFoodModal}>
          <AntDesign
            name="pluscircleo"
            size={20}
            color="black"
            style={styles.addIcon}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.separator} />

      <View style={styles.foodContent}>
        {foodData.length === 0 ? (
          <Text style={styles.noFoodText}>Intet mad tilføjet.</Text>
        ) : (
          foodData.map((item, index) => (
            <View
              key={`${item.name}-${item.quantity}-${index}`}
              style={styles.foodItem}
            >
              <TouchableOpacity
                onPress={() => {
                  setSelectedItem(item);
                  setItemName(item.name);
                  setQuantity(item.quantity);
                  setUnit(item.unit || "");
                  setShowUpdateModal(true);
                  // Log the selected item, quantity, and unit
                  console.log("Opening modal for item:", item.name);
                  console.log("Quantity:", item.quantity);
                  console.log("Unit:", item.unit || "N/A");
                }}
              >
                <Text style={styles.foodItemText}>{item.name}</Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={[styles.foodItemText, { marginRight: 5 }]}>
                    {item.quantity}
                  </Text>
                  <Text style={styles.foodItemText}>{item.unit}</Text>
                </View>
              </TouchableOpacity>
              <View style={styles.deleteIcon}>
                <TouchableOpacity
                  onPress={() => confirmDeleteItem(item)}
                  style={styles.deleteIcon}
                >
                  <MaterialCommunityIcons
                    name="delete-outline"
                    size={18}
                    color="black"
                  />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <FoodModal
          modalVisible={isFoodModalVisible}
          setModalVisible={setIsFoodModalVisible}
          userId={user?.uid}
          selectedItems={selectedItems}
          updatedItem={updatedItems}
          selectedType={selectedType}
        />
      </View>

      {/* Update Modal */}
      {showUpdateModal && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showUpdateModal}
          onRequestClose={handleCloseModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.addItemTitle}>Indtast mængde</Text>
              <View style={{ flexDirection: "row" }}>
                <TextInput
                  placeholder="Mængde"
                  keyboardType="numeric"
                  value={quantity}
                  onChangeText={setQuantity}
                  style={styles.input}
                />
                <RNPickerSelect
                  value={unit}
                  useNativeAndroidPickerStyle={false}
                  onValueChange={(value) => {
                    setUnit(value);
                  }}
                  items={[
                    { label: "stk", value: "stk" },
                    { label: "gram", value: "gram" },
                    { label: "kg", value: "kg" },
                    { label: "ml", value: "ml" },
                    { label: "dl", value: "dl" },
                    { label: "L", value: "l" },
                  ]}
                  style={pickerSelectStyles}
                  placeholder={{
                    label: "enhed",
                    value: null,
                  }}
                />
              </View>

              <View style={{ flexDirection: "row" }}>
                <CustomButton
                  customStyles={[styles.cancelButton]}
                  title="Afbryd"
                  handlePress={() => setShowUpdateModal(false)}
                />

                <CustomButton
                  customStyles={[styles.addButton]}
                  title={"Opdater"}
                  handlePress={handleUpdateItem}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {/* Confirmation Delete Modal */}
      <ConfirmDeleteModal
        isVisible={isDeleteModalVisible}
        onConfirm={handleDeleteItem}
        onCancel={() => setIsDeleteModalVisible(false)}
      />
    </View>
  );
};

export default FoodDisplay;

const styles = StyleSheet.create({
  foodContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#F0F8FF",
    borderRadius: 10,
    marginBottom: 10,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  addIcon: {
    marginLeft: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", 
    marginTop: 10, 
    width: "100%", 
  },
  foodContent: {
    marginTop: 10,
    padding: 10,
    flexDirection: "column",
    backgroundColor: "white",
    borderRadius: 5,
  },
  foodItem: {
    marginBottom: 10,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
  },
  foodItemText: {
    fontSize: 14,
    fontWeight: 400,
  },
  noFoodText: {
    fontSize: 12,
    textAlign: "center",
    color: "gray",
  },
  deleteIcon: {
    position: "absolute",
    right: 4,
    top: 10,
  },
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
  input: {
    width: "40%",
    marginTop: 20,
    marginRight: 20,
    padding: 10,
    textAlign: "center",
    justifyContent: "center",
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cancelButton: {
    backgroundColor: "grey",
    width: "40%",
    marginRight: 10,
  },
  addButton: {
    backgroundColor: "#86C5D8",
    width: "45%",
  },
});
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
  },
  inputAndroid: {
    width: "100%",
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginTop: 20,
  },
});
