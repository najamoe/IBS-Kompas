import { StyleSheet, Text, View, SafeAreaView, ScrollView, TextInput, Image } from "react-native";
import { useState } from "react";
import Toast from 'react-native-toast-message';
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "expo-status-bar";
import React from "react";
import FormField from "../components/FormField";
import CustomButton from "../components/CustomButton";
import { createUser } from "../firebase/auth";
import icon from "../../assets/icon.png";

const signUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false); 

  const submitNewUser = async () => {
    if (password !== confirmPassword) {
      Toast.show({
        type: 'error',
        text1: 'Oprettelse mislykkedes',
        text2: 'Passwords stemmer ikke overens!',
        visibilityTime: 5000,
        position: 'top',
      });
      return;
    }

    setLoading(true);

    createUser(email, password)
      .then(() => {
        setLoading(false);
        router.replace('/home');
      })
      .catch((error) => {
        setLoading(false);
        Toast.show({
          type: 'error',
          text1: 'Oprettelse mislykkedes',
          text2: error.message,
          visibilityTime: 5000,
          position: 'top',
        });
      });
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
          <Toast />
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
