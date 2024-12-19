import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Checkbox = ({ label, value, isChecked, onChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={isChecked ? [styles.checkbox, styles.activeCheckbox] : styles.checkbox}
        onPress={() => {
          onChange(!isChecked); // Toggle checked state
        }}
      >
        <MaterialIcons
          name={isChecked ? "check-box" : "check-box-outline-blank"}
          size={24}
          color={isChecked ? "#06b6d4" : "#64748b"}
        />
        <Text style={isChecked ? [styles.text, styles.activeText] : styles.text}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    width: "100%", // Make the container full width
  },
  checkbox: {
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    marginRight: 10, 
    backgroundColor: "#f3f4f6",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  activeCheckbox: {
    backgroundColor: "#06b6d4" + "11", // Lighter background when active
    borderColor: "blue",
  },
  text: {
    fontSize: 14,
    marginLeft: 5, // Space between checkbox icon and text
    color: "#6b7280",
  },
  activeText: {
    color: "#374151", // Change text color when active
  },
});

export default Checkbox;
