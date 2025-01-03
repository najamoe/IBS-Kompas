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

  const mealTypeTranslation = {
    breakfast: "Morgenmad",
    lunch: "Frokost",
    dinner: "Aftensmad",
    Snack: "Snack",
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

              {["breakfast", "lunch", "dinner", "Snack"].map((mealType) => (
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
