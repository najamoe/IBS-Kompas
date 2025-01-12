import { StatusBar } from "expo-status-bar";
import React from "react";
import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import CustomButton from "./components/CustomButton";
import { LogBox } from "react-native";

import logo from "../assets/images/logo.png";

LogBox.ignoreLogs([
  "Support for defaultProps will be removed from function components in a future major release. Use JavaScript default parameters instead.",
]);

export default function App() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Image
          source={logo}
          style={styles.logo}
          resizeMode="cover"
          borderRadius={40}
        />
        <View style={styles.textContainer}>
          <Text style={styles.mainText}>Din personlige IBS-dagbog</Text>
          <Text style={styles.subText}>
            Giver dig indsigt og kontrol over dine symptomer
          </Text>
          <Text style={styles.mainText}>Spor dine måltider og symptomer</Text>
          <Text style={styles.subText}>
            Se tilbage og opdag, hvad der kan have udløst ubehaget
          </Text>

          <CustomButton
            title="FORTSÆT"
            handlePress={() => router.push("/signin")}
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cae9f5",
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 300,
    height: 160,
    marginTop: 70,
    alignSelf: "center",
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
  },
  mainText: {
    fontSize: 30,
    color: "#798b93",

    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 5,
    paddingHorizontal: 35,
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    color: "#8da3ab",

    fontWeight: "bold",
    marginBottom: 10,
    paddingHorizontal: 35,
    textAlign: "center",
  },
  textContainer: {
    marginTop: 50,
    backgroundColor: "white",
    borderRadius: 40,
    padding: 5,
    alignItems: "center",
    width: 350,
    elevation: 5, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
  },
});
