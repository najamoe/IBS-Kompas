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

const FoodChart = ({ userId, weekStartDate }) => {
  const [loading, setLoading] = useState(true);
  const [foodData, setFoodData] = useState({});

  useEffect(() => {
    const fetchFoodData = async () => {
      try {
        const fetchedFoodData = await fetchFoodIntakeForWeek(
          userId,
          weekStartDate
        );
        setFoodData(fetchedFoodData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching food data:", error);
        setLoading(false);
      }
    };

    fetchFoodData();
  }, [userId, weekStartDate]);

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

              {["breakfast", "lunch", "dinner"].map((mealType) => (
                <View key={mealType} style={styles.mealTypeContainer}>
                  <Text style={styles.mealTypeTitle}>
                    {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                  </Text>
                  {foodData[date][mealType]?.length ? (
                    foodData[date][mealType].map((item, index) => (
                      <View key={index} style={styles.foodItem}>
                        <Text>{item.name}</Text>
                        <Text>{item.quantity}</Text>
                      </View>
                    ))
                  ) : (
                    <Text>No {mealType} logged</Text>
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
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
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
