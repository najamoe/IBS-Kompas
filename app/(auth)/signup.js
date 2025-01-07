import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { createUser } from "../firebase/auth";
import icon from "../../assets/icon.png";
import { addUserToFirestore } from "../services/firebase/userService";

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
              title="Verificér Password"
              value={confirmPassword}
              placeholder="Indtast password igen"
              handleChangeText={setConfirmPassword}
            />
            <View style={styles.buttonContainer}>
              <CustomButton
                customStyles={[
                  styles.buttonStyle,
                  { backgroundColor: "#a60202" }, // Red button
                ]}
                textStyles={styles.buttonTextStyle}
                title="Gå tilbage"
                handlePress={handleGoBack}
              />
              <CustomButton
                customStyles={[styles.buttonStyle]}
                textStyles={styles.buttonTextStyle} // Ensure consistent usage
                title={loading ? "Opretter bruger" : "Opret bruger"}
                handlePress={submitNewUser}
              />
            </View>
          </View>
          <Toast />
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
   
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
    backgroundColor: "#cae9f5",
  },
  signUpText: {
    fontWeight: "bold",
    fontSize: 40,
    color: "black",
    marginTop: 180,
    textAlign: "center",
    color: "white",
  },
  signupContainer: {
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 80,
    padding: 20,
    borderRadius: 20,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    elevation: 10, 
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
    top: 60,
    right: 30,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  buttonStyle: {
    height: 40,
    width: 120,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: "row",
    
  },
  buttonTextStyle: {
    fontSize: 14,
  },
});
