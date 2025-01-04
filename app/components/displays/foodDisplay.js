import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import FoodModal from "../modal/foodModal";
import {
  fetchFoodIntake,
  deleteFoodIntake,
} from "../../services/firebase/foodService";

const FoodDisplay = ({ type, user, selectedDate }) => {
  const [foodData, setFoodData] = useState([]);
  const [isFoodModalVisible, setIsFoodModalVisible] = useState([false]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [updatedItems, setUpdatedItems] = useState([]);
  const [selectedType, setSelectedType] = useState(type);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const fetchedFood = await fetchFoodIntake(
            user.uid,
            selectedDate,
            selectedType
          );

          setFoodData(Array.isArray(fetchedFood) ? fetchedFood : []);
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchData();
  }, [user, selectedDate, selectedType]);

  const handleFoodModal = () => {
    console.log("SelectedType:", selectedType);
    console.log("Selected type:", type);
    setSelectedType(type);
    setIsFoodModalVisible(true); 
  };

  const handleDeleteItem = async (item) => {
    try {
      await deleteFoodIntake(user.uid, item, type);
      const updatedFoodData = foodData.filter(
        (foodItem) => foodItem.name !== item.name
      );
      setFoodData(updatedFoodData);
    } catch (error) {
      console.error("Error deleting food item:", error);
    }
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
        <TouchableOpacity onPress={handleFoodModal}>
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
              <Text style={styles.foodItemText}>{item.name}</Text>
              <Text style={styles.foodItemText}>{item.quantity}</Text>

              <View style={styles.deleteIcon}>
                <TouchableOpacity
                  onPress={() => handleDeleteItem(item)}
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
    backgroundColor: "#ccc", // Choose the color you prefer for the line
    marginTop: 10, // Space between the title and the line
    width: "100%", // Make sure it spans the whole width of the container
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
});
