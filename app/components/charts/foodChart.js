import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { fetchFoodIntakeForWeek } from "../../services/firebase/foodService";
import moment from "moment";

const FoodChart = ({ userId, selectedDate }) => {
  const [foodData, setFoodData] = useState({}); // Store food data categorized by date and meal type
  const [loading, setLoading] = useState(true);

  // Fetch data whenever selectedDate or userId changes
  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        setLoading(true); // Start loading whenever the data is being fetched
        const fetchedFoodData = await fetchFoodIntakeForWeek(
          userId,
          selectedDate
        );
        if (fetchedFoodData) {
          setFoodData(fetchedFoodData); // Update the state with new data
        }
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false); // Stop loading after the fetch is done
      }
    };

    fetchFoodData();
  }, [userId, selectedDate]); // Re-run the effect when userId or selectedDate changes

  const mealTypeTranslation = {
    breakfast: "Morgenmad",
    lunch: "Frokost",
    dinner: "Aftensmad",
    snack: "Snack",
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          {Object.keys(foodData).map((date) => (
            <View key={date} style={styles.dayContainer}>
              <Text style={styles.dateTitle}>
                {moment(date).format("dddd, MMMM Do YYYY")}
              </Text>

              {["breakfast", "lunch", "dinner", "snack"].map((mealType) => (
                <View key={mealType} style={styles.mealTypeContainer}>
                  <Text style={styles.mealTypeTitle}>
                    {mealTypeTranslation[mealType] || mealType}
                  </Text>
                  {foodData[date][mealType]?.length ? (
                    foodData[date][mealType].map((item, index) => (
                      <View key={index} style={styles.foodItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.quantity}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>Ingen {mealType} logged</Text>
                  )}
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default FoodChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    marginVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dayContainer: {
    marginBottom: 20,
  },
  dateTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  mealTypeContainer: {
    marginBottom: 15,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  foodItem: {
    backgroundColor: "#e0e0e0",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
});
