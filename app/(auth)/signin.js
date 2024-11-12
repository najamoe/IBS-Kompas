import { ScrollView, StyleSheet, Text, View, Image } from "react-native";
import React from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "../firebase/FirebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Link, Redirect, router } from "expo-router";

import logo from "../../assets/images/logo.png";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";

const signIn = () => {
  const [loading, setLoading] = useState("");
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = () => {};

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View>
          <Image source={logo} style={styles.logo} resizeMode="cover" />
          <Text style={styles.loginText}>Log ind</Text>

          <View style={styles.logincontainer}>
            <FormField
              title="Email"
              placeholder="Email"
              value={form.email}
              handleChangeText={(e) => setForm({ ...form, email: e })}
              keyboardType="email-address"
            />
            <FormField
              title="Password"
              placeholder="Password"
              value={form.password}
              handleChangeText={(e) => setForm({ ...form, password: e })}
              keyboardType="default"
            />

            <CustomButton
              style={styles.buttonStyle}
              title={loading ? "Logger ind..." : "Log ind"}
              handlePress={submit}
              isLoading={isSubmitting}
            />

            <Text
              style={styles.registerText}
              onPress={() => router.push("/signup")}
            >
              Don't have an account? Register
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default signIn;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#86c5d8",
    height: '100%',
  },
  logo: {
    width: 200,
    height: 80,
    marginLeft: 15,
  },
  loginText: {
    fontSize: 30,
    color: "white",
    fontFamily: "Poppins-Regular",
    fontWeight: "bold",
    marginLeft: 15,
    marginTop: 30,
    marginBottom: 5,
    paddingHorizontal: 15,
  },
  input: {
    backgroundColor: "white",
    margin: 5,
    width: '100%',
  },
  registerText: {
    color: "white",
    textAlign: 'center',
  },
  logincontainer: {
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 20,
    padding: 5,
    borderRadius: 5,
    width: "85%", 
    alignSelf: "center", 
    justifyContent: "center", 
  },
});
