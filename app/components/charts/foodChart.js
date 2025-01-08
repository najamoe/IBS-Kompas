import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { fetchFoodIntakeForWeek } from "../../services/firebase/foodService";
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
        const foodDataByType = await fetchFoodIntakeForWeek(
          userId,
          selectedDate.format("YYYY-MM-DD")
        );

        // Get the food data for the selected date, and ensure it's categorized by meal type
        setFoodData(foodDataByType[selectedDate.format("YYYY-MM-DD")] || {});
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

  // Swipe handlers for changing dates
  const handleSwipeRight = () => {
    setSelectedDate((prevDate) => moment(prevDate).add(1, "days"));
  };

  const handleSwipeLeft = () => {
    setSelectedDate((prevDate) => moment(prevDate).subtract(1, "days"));
  };

  return (
    <GestureRecognizer
      onSwipeLeft={handleSwipeLeft}
      onSwipeRight={handleSwipeRight}
      style={styles.container}
    >
      <View style={styles.dateNavigation}>
        <TouchableOpacity onPress={handleSwipeLeft}>
          <AntDesign name="left" size={22} />
        </TouchableOpacity>
        <Text style={styles.dateText}>
          {selectedDate.format("dddd, Do MMMM  YYYY")}
        </Text>
        <TouchableOpacity onPress={handleSwipeRight}>
          <AntDesign name="right" size={22} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : Object.keys(foodData).length > 0 ? (
        ["breakfast", "lunch", "dinner", "snack"].map((mealType) => {
          const mealData = foodData[mealType];
          if (!mealData || mealData.length === 0) return null;

          return (
            <View key={mealType} style={styles.mealTypeContainer}>
              <Text style={styles.mealTypeTitle}>
                {mealTypeTranslation[mealType] || mealType}
              </Text>
              {mealData.map((item, index) => (
                <View key={index} style={styles.foodItem}>
                  <Text>{item.name}</Text>
                  <Text>
                    {item.quantity} {item.unit}
                  </Text>
                  <View style={styles.separator} />
                </View>
              ))}
            </View>
          );
        })
      ) : (
        <View style={styles.noDataContainer}>
          <Text>No food logs for this day</Text>
        </View>
      )}
    </GestureRecognizer>
  );
};

export default FoodChart;

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    marginHorizontal: 8,
    width: "96%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
    borderColor: "#86C5D8",
    borderWidth: 4,
    elevation: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  dateNavigation: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 15,
    borderColor: "#86C5D8",
    borderWidth: 1,
    width: "70%",
    padding: 10,
    borderRadius: 30,
  },

  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  mealTypeContainer: {
    marginBottom: 15,
    backgroundColor: "#F0F8FF",
    width: "90%",
    borderRadius: 10,
    padding: 10,
  },
  mealTypeTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  foodItem: {
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  noDataContainer: {
    alignItems: "center",
    justifyContent: "center",
    height: 200,
  },
  separator: {
    height: 1,
    backgroundColor: "#ccc", // Choose the color you prefer for the line
    marginTop: 10,
    width: "100%",
  },
});
