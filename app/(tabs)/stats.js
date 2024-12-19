import React, { useState, useCallback } from "react";
import { StyleSheet, RefreshControl, ScrollView, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

const Stats = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  // Format date function to display in DD/MM/YYYY format
  const formatDateDisplay = (date) => {
    const d = new Date(date);
    const day = d.getDate().toString().padStart(2, "0");
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`; // Display format
  };

  const handleDayChange = (days) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + days);
    setSelectedDate(formatDateStorage(newDate));
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <View style={styles.dateContainer}>
            {/* Header with date navigation */}
            <View style={styles.header}>
              <TouchableOpacity onPress={() => handleDayChange(-1)}>
                <Text style={styles.arrow}>◀</Text>
              </TouchableOpacity>
              <Text style={styles.dateText}>
                {formatDateDisplay(selectedDate)}
              </Text>{" "}
              {/* Display in DD/MM/YYYY */}
              <TouchableOpacity onPress={() => handleDayChange(1)}>
                <Text style={styles.arrow}>▶</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.graphFoodContainer}>
            
          <Text>Food</Text>


            </View>
          <View style={styles.graphWaterContainer}>
            



          </View>
          <View style={styles.graphBowelContainer}>
            <Text>Bowel</Text>



            </View>

            <View style={styles.graphWellnessContainer}>
            <Text>Wellness</Text>



            </View>

            <View style={styles.graphSymptomContainer}>
            <Text>Symptom</Text>



            </View>

            
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gradient: {
    flex: 1,
    width: "100%",
  },
  dateContainer: {
    backgroundColor: "white",
    borderRadius: 30,
    width: "90%",
    padding: 5,
    marginTop: 25,
    marginBottom: 15,
    alignSelf: "center",
    justifyContent: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  arrow: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    margin: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  graphFoodContainer:{
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphWaterContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphBowelContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphWellnessContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  graphSymptomContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    width: "94%",
    height: 100,
    marginTop: 20,
    marginLeft: 10,
    alignItems: "center",
    justifyContent: "center",
  },


});
