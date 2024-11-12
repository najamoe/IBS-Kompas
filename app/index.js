import { StatusBar } from "expo-status-bar";
import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-splash-screen";
import { Link, Redirect, router } from "expo-router";
import { useEffect } from "react";
import CustomButton from "./components/CustomButton";

import logo from "../assets/images/logo.png";

export default function App() {
  // Load fonts using the useFonts hook
  let [fontsLoaded] = useFonts({
    "Poppins-Regular": require("../assets/fonts/PoppinsRegular.ttf"),
  });

  // Keep the splash screen visible while fonts are loading
  useEffect(() => {
    const prepare = async () => {
      await SplashScreen.preventAutoHideAsync();
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };

    prepare();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Render nothing while fonts are loading
  }

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

          <CustomButton title="Opret dig" handlePress={() => router.push('/signup')} />
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
  },
  mainText: {
    fontSize: 30,
    color: "#798b93",
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 5,
    paddingHorizontal: 35,
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    color: "#8da3ab",
    fontFamily: "Poppins-Regular",
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
  },
});
