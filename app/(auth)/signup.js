import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, Image } from "react-native";
import { useState } from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { createUser } from "../firebase/auth";
import icon from "../../assets/icon.png";
import { reloadAppAsync } from "expo";

const signUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("")
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState("");

  const submitNewUser = async () => {
    setLoading(true);

    // Validation check for password length and matching passwords
    if (password.length <= 5) {
      alert("Password skal indeholde 6 tegn");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords er ikke ens");
      setLoading(false);
      return;
    }

    try {
      await createUser(email, password); // Create user with email and password
      setLoading(false);
      router.push('/home'); // Redirect to home after successful creation
    } catch (error) {
      setLoading(false);
      console.error("Error creating user:", error);
      // Handle any error during user creation (you can show a toast here)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Image source={icon} style={styles.icon}/>
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

            <CustomButton
              style={styles.buttonStyle}
              title={loading ? "Opretter bruger" : "Opret bruger"}
              handlePress={submitNewUser}
              
            />

          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>
    </SafeAreaView>
  );
};

export default signUp;

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

