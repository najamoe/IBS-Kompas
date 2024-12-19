import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";

const Stats = () => {
  const [selectedMode, setSelectedMode] = useState("Date"); // Options: Date, Week, Month
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM-DD"));
  const [showCalendar, setShowCalendar] = useState(false);

  const daysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();

  const renderCalendar = () => {
    const date = moment(selectedDate);
    const year = date.year();
    const month = date.month();
    const days = daysInMonth(year, month);

    // Generate days for the current month
    const daysArray = Array.from({ length: days }, (_, i) => {
      const dayDate = moment([year, month, i + 1]).format("YYYY-MM-DD");
      return (
        <TouchableOpacity
          key={i}
          style={[
            styles.calendarDay,
            dayDate === selectedDate && styles.selectedDay,
          ]}
          onPress={() => {
            setSelectedDate(dayDate);
            if (selectedMode === "Date") setShowCalendar(false);
          }}
        >
          <Text
            style={[
              styles.dayText,
              dayDate === selectedDate && styles.selectedDayText,
            ]}
          >
            {i + 1}
          </Text>
        </TouchableOpacity>
      );
    });

    return (
      <View style={styles.calendarContainer}>
        <Text style={styles.monthText}>
          {date.format("MMMM YYYY")}
        </Text>
        <View style={styles.daysWrapper}>{daysArray}</View>
      </View>
    );
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

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <View style={styles.container}>
          <View style={styles.datePickerContainer}>
            <Text style={styles.header}>Visning</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedMode("Date");
                setShowCalendar(true);
              }}
            >
              <Text style={styles.buttonText}>Dato</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedMode("Week");
                setShowCalendar(true);
              }}
            >
              <Text style={styles.buttonText}>Uge</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setSelectedMode("Month");
                setShowCalendar(true);
              }}
            >
              <Text style={styles.buttonText}>Måned</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.selectedDateContainer}>
            <Text style={styles.selectedText}>{renderSelectedValue()}</Text>
          </View>

          {showCalendar && renderCalendar()}
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
  calendarContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  monthText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  daysWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  calendarDay: {
    width: 40,
    height: 40,
    margin: 5,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
  },
  selectedDay: {
    backgroundColor: "blue",
  },
  dayText: {
    fontSize: 14,
  },
  selectedDayText: {
    color: "white",
    fontWeight: "bold",
  },
});
