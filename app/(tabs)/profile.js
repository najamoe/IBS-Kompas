import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../firebase/auth";

import CustomButton from "../components/CustomButton";
import { deleteUser } from "firebase/auth";

const profile = () => {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View style={styles.container}>
            <CustomButton
              title="Sign Out"
              style={styles.signOutButton}
              handlePress={signOutUser}
            />
            <CustomButton
              title="Slet konto"
              style={styles.DeleteButton}
              handlePress={deleteUser}
              iconName="trash"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  }
});
