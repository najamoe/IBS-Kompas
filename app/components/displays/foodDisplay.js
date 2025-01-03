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
  const [SelectedType, setSelectedType] = useState(type);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const fetchedFood = await fetchFoodIntake(
            user.uid,
            selectedDate,
            SelectedType
          );

          setFoodData(Array.isArray(fetchedFood) ? fetchedFood : []);
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchData();
  }, [user, selectedDate, SelectedType]);

  const handleFoodModal = () => {
    setSelectedType(type);
    setIsFoodModalVisible(true); // Open the FoodModal
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
          <AntDesign name="pluscircleo" size={24} color="black" style={styles.addIcon} />
        </TouchableOpacity>
      </View>
      <View style={styles.foodContent}>
        {foodData.length === 0 ? (
          <Text>Ingen madindtag fundet for denne dag.</Text>
        ) : (
          foodData.map((item, index) => (
            <View
              key={`${item.name}-${item.quantity}-${index}`}
              style={styles.foodItem}
            >
              <Text>{item.name}</Text>
              <Text>{item.quantity}</Text>

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
          SelectedType={SelectedType}
        />
      </View>
    </View>
  );
};

export default FoodDisplay;

// Example styles
const styles = StyleSheet.create({
  foodContainer: {
    width: "90%",
    padding: 20,
    backgroundColor: "#f9f9f9",
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
  foodContent: {
    marginTop: 10,
    flexDirection: "column",
  },
  foodItem: {
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
  },
  deleteIcon: {
    position: "absolute",
    right: 4,
    top: 10,
  },
});
