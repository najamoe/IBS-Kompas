import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, FlatList } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from "moment";

const Stats = () => {
  const [selectedMode, setSelectedMode] = useState("Date"); // Options: Date, Week, Month
  const [selectedDate, setSelectedDate] = useState(new Date()); // Use Date object
  const [showCalendar, setShowCalendar] = useState(false);

  const handleSelection = (mode) => {
    setSelectedMode(mode);
    setShowCalendar(mode); 
  };

  const renderSelectedValue = () => {
    if (selectedMode === "Date") {
      return `Valgt dato: ${moment(selectedDate).format("YYYY-MM-DD")}`;
    } else if (selectedMode === "Week") {
      const startOfWeek = moment(selectedDate).startOf("isoWeek").format("YYYY-MM-DD");
      const endOfWeek = moment(selectedDate).endOf("isoWeek").format("YYYY-MM-DD");
      return `Valgt Uge: ${startOfWeek} to ${endOfWeek}`;
    } else if (selectedMode === "Month") {
      return `Valgt Måned: ${moment(selectedDate).format("MMMM YYYY")}`;
    }
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || selectedDate;
    setShowCalendar(false);
    setSelectedDate(currentDate);
  };

  const renderMonthList = () => {
    const months = [];
    const currentYear = moment().year(); // Get the current year
    for (let i = 0; i < 12; i++) {
      const month = moment().month(i);
      months.push({
        id: month.format("YYYY-MM"),
        title: month.format("MMMM YYYY"),
      });
    }

  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.header}>Visning</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSelection("Date")}
            >
              <Text style={styles.buttonText}>Dato</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSelection("Week")}
            >
              <Text style={styles.buttonText}>Uge</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => handleSelection("Month")}
            >
              <Text style={styles.buttonText}>Måned</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedText}>{renderSelectedValue()}</Text>
          </View>

          {selectedMode === "Month" && renderMonthList()} {/* Display month list if in month view */}

          {showCalendar && (
            <DateTimePicker
              value={selectedDate}
              mode={selectedMode === "Date" ? "date" : "time"} // Use "time" for week if needed
              display="default"
              onChange={handleDateChange}
            />
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default Stats;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  gradient: {
    width: "100%",
  },
  datePickerContainer: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    width: "80%",
    height: 40,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  header: {
    fontSize: 16,
    fontWeight: "500",
  },
  button: {
    borderColor: "black",
    borderWidth: 1,
    padding: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: "black",
    fontSize: 14,
  },
  selectedText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  selectedDateContainer: {
    backgroundColor: "white",
    borderColor: "black",
    borderWidth: 1,
    borderRadius: 50,
    width: "80%",
    height: 40,
    marginTop: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  monthButton: {
    backgroundColor: "#cae9f5",
    padding: 10,
    marginVertical: 5,
    borderRadius: 8,
    alignItems: "center",
    width: "80%",
  },
  monthButtonText: {
    fontSize: 16,
    fontWeight: "500",
  },
});
