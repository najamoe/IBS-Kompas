import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { fetchFoodIntake } from "../../services/firebase/foodService"; 
import moment from "moment";
import GestureRecognizer from "react-native-swipe-gestures"; 

const FoodChart = ({ userId, initialDate }) => {
  const [foodData, setFoodData] = useState({});
  const [selectedDate, setSelectedDate] = useState(initialDate || moment());
  const [loading, setLoading] = useState(true);

  // Fetch food data for the selected date
  useEffect(() => {
    const fetchFoodData = async () => {
      setLoading(true);
      try {
        const dateString = selectedDate.format("YYYY-MM-DD");
        const meals = ["breakfast", "lunch", "dinner", "snack"];
        const fetchedData = {};

        for (const meal of meals) {
          const foodForMeal = await fetchFoodIntake(userId, dateString, meal);
          fetchedData[meal] = foodForMeal;
        }

        setFoodData(fetchedData);
      } catch (error) {
        console.error("Error fetching food data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [userId, selectedDate]);

  const mealTypeTranslation = {
    breakfast: "Morgenmad",
    lunch: "Frokost",
    dinner: "Aftensmad",
    snack: "Snack",
  };

  // Swipe handlers
  const handleSwipeLeft = () => {
    setSelectedDate((prevDate) => moment(prevDate).add(1, "days"));
  };

  const handleSwipeRight = () => {
    setSelectedDate((prevDate) => moment(prevDate).subtract(1, "days"));
  };

  return (
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      style={styles.container}
    >
      <View>
        <View style={styles.dateNavigation}>
          <TouchableOpacity onPress={handleSwipeRight}>
            <Text style={styles.navButton}>◀</Text>
          </TouchableOpacity>
          <Text style={styles.dateText}>
            {selectedDate.format("dddd, MMMM Do YYYY")}
          </Text>
          <TouchableOpacity onPress={handleSwipeLeft}>
            <Text style={styles.navButton}>▶</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <ScrollView>
            {["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
              const mealData = foodData[mealType];
              if (!mealData || mealData.length === 0) {
                return null; // Skip rendering if no data for the meal type
              }

              return (
                <View key={mealType} style={styles.mealTypeContainer}>
                  <Text style={styles.mealTypeTitle}>
                    {mealTypeTranslation[mealType] || mealType}
                  </Text>
                  {mealData.map((item, index) => (
                    <View key={index} style={styles.foodItem}>
                      <Text>{item.name}</Text>
                      <Text>{item.quantity}</Text>
                    </View>
                  ))}
                </View>
              );
            })}
          </ScrollView>
        )}
      </View>
    </GestureRecognizer>
  );
};

export default FoodChart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dateNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  navButton: {
    fontSize: 24,
    color: "blue",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
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
