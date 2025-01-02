import React from "react";
import { View, Text, StyleSheet } from "react-native";

const FoodDisplay = ({ fetchedFood, mealType }) => {
  // Define a mapping for mealType to Danish labels
  const mealTypeLabels = {
    breakfast: "Morgenmad",
    lunch: "Frokost",
    dinner: "Aftensmad",
    snack: "Snack",
  };

  return (
    <View style={styles.foodContainer}>
      {/* Display the meal type dynamically */}
      <Text style={styles.mealTypeTitle}>
        {mealTypeLabels[mealType] || "Ukendt måltid"}
      </Text>

      <View style={styles.foodContent}>
        {fetchedFood.length === 0 ? (
          <Text>Ingen madindtag fundet for denne dag.</Text>
        ) : (
          fetchedFood.map((item) => (
            <View key={item.id} style={styles.foodItem}>
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


