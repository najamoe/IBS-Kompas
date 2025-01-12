import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import React from "react";
import { useState } from "react";
import { router } from "expo-router";
import { signInUser, resetPassword } from "../firebase/auth";
import ResetPasswordModal from "../components/modal/passwordReset";
import logo from "../../assets/images/logo.png";
import CustomButton from "../components/CustomButton";
import FormField from "../components/FormField";

const SignIn = () => {
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
    if (!email || !password) {
      Alert.alert("Indtast venligst både email og adgangskode.");
      return;
    }
    setLoading(true); // Start loading state

    signInUser(email, password)
      .then(() => {
        setLoading(false);
        router.push("/home");
      })
      .catch((error) => {
        setLoading(false);
        console.error("Sign in error:", error); // Log the error for debugging

        // Handle specific error codes from Firebase
        if (error.code === "auth/invalid-credential") {
          Alert.alert("Fejl", "Ugyldig email eller adgangskode. Prøv igen.");
        }
      });
  };

  const handlePasswordReset = async () => {
    try {
      await resetPassword(resetEmail);
      setModalVisible(false);
      Alert.alert("Email afsendt", "Tjek din email for at nulstille din adgangskode");
    } catch (error) {
      console.error("Password reset error:", error);
      Alert.alert("Fejl", "Kunne ikke sende email");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"} // Adjust behavior based on platform
    >
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
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
                onPress={() => router.push("/signup")}
              >
                {" "}
                OPRET DIG HER
              </Text>
            </Text>
          </View>
        </View>
      </ScrollView>

      <ResetPasswordModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        handlePasswordReset={handlePasswordReset}
        resetEmail={resetEmail}
        setResetEmail={setResetEmail}
      />
    </KeyboardAvoidingView>
  );
};

export default SignIn;

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
    marginTop: 80,
  },
  loginText: {
    fontSize: 34,
    color: "white",

    fontWeight: "bold",
    marginLeft: 20,
    marginTop: 90,
    marginBottom: 60,
    paddingHorizontal: 15,
  },
  input: {
    backgroundColor: "white",
    width: "100%",
  },
  CustomInputStyle: {
    marginTop: 10,
    marginBottom: 10,
  },
  registerText: {
    color: "black",
    textAlign: "center",
    fontSize: 14,
  },
  logincontainer: {
    alignItems: "center",
    backgroundColor: "white",
    marginTop: 10,
    padding: 20,
    borderRadius: 30,
    width: "85%",
    alignSelf: "center",
    justifyContent: "center",
    elevation: 5, // Shadow for Android
  },
  signupStyle: {
    fontWeight: "bold",
    fontSize: 14,
    marginLeft: 10,
  },
  forgotPasswordText: {
    color: "blue",
    textAlign: "center",
    marginTop: 10,
    marginBottom: 10,
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
    marginBottom: 5,
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "gray",
  },
  buttonStyle: {
    marginTop: 30,
  },
  buttonContainer: {
    flexDirection: "row",
  },
  modalButtonStyle: {
    height: 40,
    width: 90,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
    flexDirection: "row",
  },
  buttonTextStyle: {
    fontSize: 14,
  },
});
