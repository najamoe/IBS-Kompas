import React from "react";
import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const Checkbox = ({ options, checkedValues, onChange, style }) => {
  return (
    <View style={[styles.container, style]}>
      {options.map((option) => {
        const active = checkedValues.includes(option.value);

        return (
          <TouchableOpacity
            key={option.value}
            style={active ? [styles.checkbox, styles.activeCheckbox] : styles.checkbox}
            onPress={() => {
              const updatedCheckedValues = active
                ? checkedValues.filter((value) => value !== option.value)
                : [...checkedValues, option.value];
              onChange(updatedCheckedValues);
            }}
          >
            <MaterialIcons
              name={active ? "check-box" : "check-box-outline-blank"}
              size={24}
              color={active ? "#06b6d4" : "#64748b"}
            />
            <Text style={active ? [styles.text, styles.activeText] : styles.text}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row", // Change this to row for horizontal layout
    flexWrap: "wrap", // Allows items to wrap onto the next line if necessary
    width: "100%",
    height: 50,
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
    backgroundColor: "#06b6d4" + "11",
    borderColor: "blue",
  },
  text: {
    fontSize: 14,
    marginLeft: 5,
    color: "#6b7280",
  },
  activeText: {
    color: "#374151",
  },
});

export default Checkbox;
