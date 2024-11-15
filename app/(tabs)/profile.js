import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, View, Modal } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { useState } from "react";
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from "react-native-safe-area-context";
import { signOutUser, deleteUserAccount } from "../firebase/auth";

import CustomButton from "../components/CustomButton";

const profile = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleDeleteUser = async () => {
    try {
      console.log("Delete account function triggered");
      await deleteUserAccount();
      setModalVisible(false);
    } catch (error) {
      console.error("Noget gik galt med sletning af konto", error)
    }
  }
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
        <ScrollView contentContainerStyle={{ height: "100%" }}>
          <View style={styles.container}>
            <CustomButton
              title="Sign Out"
              style={styles.signOutButton}
              handlePress={() => {
                console.log("Sign Out button pressed");
                signOutUser();
              }}
            />
            <CustomButton
              title="Slet konto"
              style={styles.DeleteButton}
              handlePress={() => {
                console.log("Slet konto button pressed");
                setModalVisible(true);
              }}
              iconName="trash"
            />
          </View>
        </ScrollView>
        <StatusBar backgroundColor="#161622" style="light" />
      </LinearGradient>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nulstil password</Text>
            <Text>Er du sikker på du ønsker at slette din konto?</Text>
            <Text>Handlingen kan ikke fortrydes</Text>
            <CustomButton title="Ja, slet konto" handlePress={handleDeleteUser} />
            <CustomButton
              title="Nej, slet ikke min konto"
              handlePress={() => {
                console.log("Cancel button pressed");
                setModalVisible(false);
              }}
              style={styles.cancelButton}
            />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
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
