import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
} from "react-native";
import { useState } from "react";
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
      Alert.alert("Adgangskoderne matcher ikke.");
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
      // Handle the Firebase authentication errors with specific messages
      if (error.code === "auth/email-already-in-use") {
        Alert.alert("Fejl", "Den emailadresse er allerede i brug!");
      } else if (error.code === "auth/invalid-email") {
        Alert.alert("Fejl", "Den angivne emailadresse er ugyldig!");
      } else if (error.code === "auth/weak-password") {
        Alert.alert("Fejl", "Adgangskoden skal være over 6 tegn");
      } else {
        // Generic error message for other cases
        Alert.alert("Fejl", "Noget gik galt.");
      }
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
              customStyles={[styles.buttonStyle, { backgroundColor: "grey" }]}
              textStyles={styles.buttonTextStyle}
              title="Gå tilbage"
              handlePress={handleGoBack}
            />
            <CustomButton
              customStyles={[styles.buttonStyle]}
              textStyles={styles.buttonTextStyle}
              title={loading ? "Opretter bruger..." : "Opret bruger"}
              handlePress={submitNewUser}
            />
          </View>
        </View>
       
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
