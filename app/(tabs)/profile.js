import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser } from "../firebase/auth";

import CustomButton from "../components/CustomButton";

const profile = () => {
  return (
    <SafeAreaView>
      <ScrollView>
        <View style={styles.container}>
          <CustomButton
            title="Sign Out"
            style={styles.signOutButton}
            handlePress={signOutUser}
          />
        </View>
      </ScrollView>
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cae9f5",
    alignItems: "center",
    justifyContent: "center",
  },
  signOutButton: {
    marginBottom: 10,
  },
});
