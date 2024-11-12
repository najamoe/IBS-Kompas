import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const insert = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <Text>INSERT</Text>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default insert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
