import { StyleSheet, Text, View, SafeAreaView, ScrollView, Image,} from "react-native";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { createUser } from "../firebase/auth";
import icon from "../../assets/icon.png";
import { addUserToFirestore } from '../firebase/firestoreService';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const submitNewUser = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Oprettelse mislykkedes",
        text2: "Passwords stemmer ikke overens!",
        visibilityTime: 5000,
        position: "top",
      });
      return;
    }

    setLoading(true);

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUser(email, password);
      const uid = userCredential.user.uid; // Get the UID of the new user

      // Prepare basic user data for Firestore
      const userData = {
        email,
        uid,
        createdAt: new Date(),
        profileCompleted: false, // Flag to track profile completion
      };

      await addUserToFirestore(uid, userData);

      setLoading(false);
      router.replace("/home"); // Redirect to home or profile setup screen
    } catch (error) {
      setLoading(false);
      console.error("Error during signup:", error);
    }
  };

  const handleGoBack = () => {
    router.back(); // Go back to the previous screen
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <Image source={icon} style={styles.icon} />
          <Text style={styles.signUpText}>Opret bruger</Text>
          <View style={styles.signupContainer}>
            <FormField
              title="Email"
              value={email}
              placeholder="Enter your email"
              handleChangeText={setEmail}
            />
            <FormField
              title="Password"
              value={password}
              placeholder="Indtast password"
              handleChangeText={setPassword}
            />
            <FormField
              title="verificér Password"
              value={confirmPassword}
              placeholder="Indtast password igen"
              handleChangeText={setConfirmPassword}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                style={styles.buttonStyle}
                title={loading ? "Opretter bruger" : "Opret bruger"}
                handlePress={submitNewUser}
              />
              <CustomButton
                containerStyles={[styles.button, { backgroundColor: "#a60202", marginTop: 5 }]} 
                title="Gå tilbage"
                handlePress={handleGoBack}
              />
            </View>
          </View>
          <Toast />
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  signUpText: {
    fontWeight: "bold",
    fontSize: 44,
    color: "black",
    marginTop: 200,
    textAlign: "center",
  },
  signupContainer: {
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 80,
    padding: 20,
    borderRadius: 5,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
  },
  label: {
    fontSize: 16,
    color: "black",
    marginBottom: 10,
  },
  icon: {
    width: 80,
    height: 80,
    position: "absolute",
    top: 40,
    right: 20,
  },
});
