import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";

const insert = () => {
  return (
    <SafeAreaView style={styles.container}>
    
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <Text>INSERT</Text>
        </ScrollView>
     
    </SafeAreaView>
  );
};

export default insert;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cae9f5", 
    alignItems: "center",
    justifyContent: "center",
  },
 
});
