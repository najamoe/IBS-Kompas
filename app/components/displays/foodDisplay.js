import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { fetchFoodIntake } from "../../services/firebase/foodService";

const FoodDisplay = ({ type, user, selectedDate }) => {
  const [foodData, setFoodData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (user) {
          const fetchedFood = await fetchFoodIntake(user.uid, selectedDate, type);
          console.log(
            "Fetched food:- fetched from foodDisplay.js",
            fetchedFood
          ); // Add logging here
          setFoodData(Array.isArray(fetchedFood) ? fetchedFood : []);
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      }
    };
    fetchData();
  }, [user, selectedDate]);

  const mealTypeLabels = {
    breakfast: "Morgenmad",
    lunch: "Frokost",
    dinner: "Aftensmad",
    snack: "Snack",
  };

  return (
    <View style={styles.foodContainer}>
      <Text style={styles.mealTypeTitle}>{mealTypeLabels[type]}</Text>

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
            </View>
          ))
        )}
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
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  foodContent: {
    marginTop: 10,
  },
  foodItem: {
    marginBottom: 10,
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
  },
});
