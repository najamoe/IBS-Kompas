import { View, Text } from "react-native";
import React from "react";
import { firestore } from "../firebase/FirebaseConfig";

export const saveWaterIntake = async (amount) => {
  try {
    await firestore
      .collection("users")
      .doc("userId")
      .collection("water")
      .add({
        amount: parseFloat(amount),
        date: new Date().toISOString(),
      });
  } catch (error) {
    console.error("Error saving water intake:", error);
  }
};
