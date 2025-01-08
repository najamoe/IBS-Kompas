import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React, {useEffect, useState} from "react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  addWellnessLog,
  subscribeWellnessLog,
} from "../../services/firebase/wellnessService";

const WellnessDisplay = ({user, selectedDate}) => {
  const [selectedMood, setSelectedMood] = useState(null);

  // Subscribe to real-time updates when user is set
  useEffect(() => {
    if (user && selectedDate) {
      const unsubscribe = subscribeWellnessLog(
        user.uid,
        selectedDate,
        (emoticonType) => {
          setSelectedMood(emoticonType);
        }
      );
      // Cleanup on component unmount
      return () => unsubscribe();
    }
  }, [user, selectedDate]);

  const emoticons = [
    { name: "emoticon-excited-outline", color: "#006147" },
    { name: "emoticon-outline", color: "#03a137" },
    { name: "emoticon-happy-outline", color: "#4CAF50" },
    { name: "emoticon-neutral-outline", color: "#3228ed" },
    { name: "emoticon-sad-outline", color: "#ed8505" },
    { name: "emoticon-cry-outline", color: "#a65c02" },
    { name: "emoticon-sick-outline", color: "#F44336" },
  ];

  const handleEmoticonPress = async (emoticon) => {
    if (!user) {
      //Insert error handling
      return;
    }
    try {
      setSelectedMood(emoticon);
      // Call addWellnessLog service to log the emoticon
      await addWellnessLog(user.uid, emoticon);
    } catch (error) {
      console.error("Error saving emoticon:", error.message);
    }
  };

  return (
    <View style={styles.WellnessContainer}>
      <Text style={styles.logTitle}>Hvordan har du det idag?</Text>
      <View style={styles.emoticonContainer}>
        {emoticons.map((icon) => (
          <TouchableOpacity
            key={icon.name}
            onPress={() => handleEmoticonPress(icon.name)}
            style={[
              styles.emoticonWrapper,
              selectedMood === icon.name && styles.selectedEmoticon,
            ]}
          >
            <MaterialCommunityIcons
              name={icon.name}
              size={selectedMood === icon.name ? 38 : 30} // Increase size if selected
              color={selectedMood === icon.name ? "white" : icon.color}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default WellnessDisplay;

const styles = StyleSheet.create({
  WellnessContainer: {
    width: "96%",
    padding: 10,
    borderRadius: 20,
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    alignContent: "center",
    elevation: 5,
  },
  emoticonWrapper: {
    margin: 6,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },
  emoticonContainer: {
    flexDirection: "row",
    elevation: 10,
  },
  selectedEmoticon: {
    backgroundColor: "#86C5D8",
    padding: 2,
  },
  logTitleContainer: {
    marginBottom: 10,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 10,
  },
});
