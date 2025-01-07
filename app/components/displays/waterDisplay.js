import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  addWaterIntake,
  subscribeToDailyWaterIntake,
  removeWaterIntake,
} from "../../services/firebase/waterService";
import WaterModal from "../modal/waterModal";

const WaterDisplay = ({user, selectedDate}) => {
  const [waterIntake, setWaterIntake] = useState(0);
  const [isWaterModalVisible, setIsWaterModalVisible] = useState(false);
  const [isAdding, setIsAdding] = useState(true);

  //Water intake 
  useEffect(() => {
    if (user && selectedDate) {
      // Subscribe to daily water intake updates in Firestore
      const unsubscribe = subscribeToDailyWaterIntake(
        user.uid,
        selectedDate,
        (total) => {
          setWaterIntake(total); // Update state when water intake changes
        }
      );

      // Cleanup function to unsubscribe when the component unmounts or user changes
      return () => unsubscribe();
    }
  }, [user, selectedDate]);

  const handleAddWater = async (amount) => {
    if (user) {
      const newWaterIntake = waterIntake + amount;
      try {
        await addWaterIntake(user.uid, newWaterIntake); //firestore state
        setWaterIntake(newWaterIntake); // local state
      } catch (error) {
       
        console.error("Error adding water intake:", error);
      }
    } else {
      alert("Please sign in to log your water intake.");
    }
  };

  const handleRemoveWater = async (amount) => {
    if (user) {
      try {
        const newWaterIntake = await removeWaterIntake(
          user.uid,
          selectedDate,
          amount
        ); // Pass the amount to remove
        setWaterIntake(newWaterIntake); // Update the local state with the new value
      } catch (error) {
        //Insert error handling
      }
    } else {
      alert("Please sign in to remove water intake.");
    }
  };

  return (
    <View style={styles.waterContainer}>
      <View style={styles.logTitleContainer}>
        <Text style={styles.logTitle}>Tilføj væskeindtag</Text>
      </View>

      <View style={styles.waterContent}>
        <Text style={styles.waterIntakeText}>Væske {waterIntake} l</Text>
        <View style={styles.waterIconContainer}>
          <Ionicons
            name="remove-circle-outline"
            size={34}
            color="red"
            onPress={() => {
              setIsWaterModalVisible(true);
              setIsAdding(false);
            }}
          />
          <Ionicons
            name="add-circle-outline"
            size={34}
            marginLeft={10}
            color="green"
            onPress={() => {
              setIsWaterModalVisible(true);
              setIsAdding(true);
            }}
          />
        </View>

        <WaterModal
          isVisible={isWaterModalVisible}
          onClose={() => setIsWaterModalVisible(false)}
          onAddWater={isAdding ? handleAddWater : handleRemoveWater}
        />
      </View>
    </View>
  );
};

export default WaterDisplay;

const styles = StyleSheet.create({
    waterContainer: {
    width: "100%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "center",
    elevation: 10,
  },
  waterContent: {
    alignItems: "center",
  },
  waterIntakeText: {
    fontSize: 16,
    fontWeight: "400",
    marginTop: 10,
    borderColor: "black",
    borderWidth: 0.2,
    padding: 5,
    borderRadius: 50,
    width: 140,
    textAlign: "center",
  },
  waterIconContainer: {
    flexDirection: "row",
    marginTop: 10,
    width: "34%",
    paddingHorizontal: 15,
  },

  
});
