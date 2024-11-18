import { ScrollView, StyleSheet, Text, View, Image, Modal } from "react-native";
import React from "react";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { signInUser, resetPassword } from "../firebase/auth";

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
  const [modalVisible, setModalVisible] = useState(false);
  const [resetEmail, setResetEmail] = useState("");

  const submit = () => {
    const { email, password } = form;

    signInUser(email, password)
      .then(() => {
        setLoading(false);
        router.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        Alert.alert("Login Error", error);
      });

    setLoading(true);
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(resetEmail);
      setModalVisible(false);
    } catch (error) {
      console.error("Password reset error:", error);
    }
  };

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
              style={styles.forgotPasswordText}
              onPress={() => setModalVisible(true)}
            >
              Glemt password?
            </Text>

            <Text style={styles.registerText}>
              Har du ikke en konto?
              <Text
                style={styles.signupStyle}
                onPress={() => router.push("/SignUp")}
              >
                {" "}
                OPRET DIG HER
              </Text>
            </Text>
          </View>
        </View>
        <Toast />
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nulstil password</Text>
            <FormField
              title=""
              placeholder="Indtast din email"
              value={resetEmail}
              handleChangeText={setResetEmail}
              keyboardType="email-address"
            />
            <CustomButton title="Submit" handlePress={handlePasswordReset} />
            <CustomButton
              title="Cancel"
              handlePress={() => setModalVisible(false)}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default signIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#86c5d8",
    height: "100%",
  },
  logo: {
    width: 200,
    height: 80,
    marginLeft: 15,
    marginTop: 40,
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
    width: "100%",
  },
  registerText: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
  logincontainer: {
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 30,
    padding: 20,
    borderRadius: 5,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
  },
  signupStyle: {
    fontWeight: "bold",
    fontFamily: "Poppins-Regular",
    fontSize: 14,
  },
  forgotPasswordText: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
    textDecorationLine: "underline",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "gray",
  },
});
