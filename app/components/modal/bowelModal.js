import React, { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";
import Modal from "react-native-modal";
import SwitchToggle from "react-native-switch-toggle";
import Slider from "@react-native-community/slider";
import { LinearGradient } from "expo-linear-gradient";
import { addBowelLog } from "../../services/firebase/bowelService";
import { getAuth } from "firebase/auth";

import { Entypo } from "@expo/vector-icons";

// Import all the images
import type1 from "../../../assets/images/bowel/type1.png";
import type2 from "../../../assets/images/bowel/type2.png";
import type3 from "../../../assets/images/bowel/type3.png";
import type4 from "../../../assets/images/bowel/type4.png";
import type5 from "../../../assets/images/bowel/type5.png";
import type6 from "../../../assets/images/bowel/type6.png";
import type7 from "../../../assets/images/bowel/type7.png";

const BowelModal = ({ isVisible, onClose }) => {
  const formatDate = () => {
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, "0");
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0");
    const year = currentDate.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const currentDate = formatDate();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedBowelType, setSelectedBowelType] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const [infoText, setInfoText] = useState("");
  const [pain, setPain] = useState("");
  const [blood, setBlood] = useState(false);
  const [urgent, setUrgent] = useState(false);
  const [notes, setNotes] = useState("");
  const [date, setDate] = useState(currentDate);
  // states for intensity text
  const [showIntensity, setShowIntensity] = useState(false);
  const [currentIntensity, setCurrentIntensity] = useState(null);

  const handleInfoPress = (type) => {
    setInfoText(bowelTypeInfo[type]);
    setIsInfoModalVisible(true);
  };

  const handleInfoModalClose = () => {
    setIsInfoModalVisible(false);
  };

  const handleBowelTypeSelect = (type) => {
    setSelectedBowelType(type);
    setCurrentStep(2);
  };

  const handleSliderChange = (value) => {
    setPain(value);
    setCurrentIntensity(value);
    setShowIntensity(true);
    setTimeout(() => {
      setShowIntensity(false);
    }, 1500);
  };

  const handleSaveLog = async () => {
    if (!selectedBowelType) {
      Alert.alert("Error", "Please select a bowel type.");
      return;
    }

    try {
      // Get the current userId
      const user = getAuth().currentUser; // Get the currently authenticated user
      if (!user) {
        Alert.alert("Error", "You must be logged in to save a bowel log.");
        return;
      }

      // Call the addBowelLog service with the necessary parameters
      await addBowelLog(
        user.uid,
        selectedBowelType,
        pain,
        blood,
        urgent,
        notes,
        date
      );
      Alert.alert("Gemt", "Informationer er gemt");
      onClose(); // Close the modal after saving
    } catch (error) {
      console.error("Error saving bowel log:", error);
      Alert.alert("Error", "Noget gik galt - prøv igen");
    }
  };

  const handleGoBack = () => {
    setCurrentStep(1); // Navigate back to the first step
  };

  const handleClose = () => {
    setSelectedBowelType(null);
    setPain("");
    setBlood(false);
    setUrgent(false);
    setNotes("");
    setDate(currentDate);
    setCurrentStep(1);
    onClose();
  };

  // Mapping of bowel types to images
  const bowelImages = {
    type1,
    type2,
    type3,
    type4,
    type5,
    type6,
    type7,
  };

  const bowelTypeInfo = {
    type1: "Afføringen er små separate klumper som ligner nødder",
    type2: "Afføringen er en pølseform, som små nødder samlet",
    type3: "Afføringen er en pølseform med revner på ydersiden",
    type4: "Afføringen er en pølseform der er smidig og blød",
    type5: "Afføringen er bløde klumper",
    type6: "Afføringen er blød iturevne småstykker",
    type7: "Afføringen er vandig og uden klumper eller iturevne småstykker ",
  };

  return (
    <Modal
      isVisible={isVisible}
      animationIn="fadeIn"
      animationOut="fadeOut"
      backdropColor="rgba(0, 0, 0, 0.6)"
      onBackdropPress={onClose}
      onRequestClose={onClose}
      style={styles.modal}
    >
      <View style={styles.container}>
        {/* Close Button (X) */}
        <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
          <Entypo name="cross" size={30} color="black" />
        </TouchableOpacity>
        {currentStep === 1 && (
          <>
            <Text style={styles.modalTitle}>Afførings-dagbog</Text>
            <Text style={styles.subtitle}>Vælg din afføringstype</Text>
            <Text style={styles.dateText}>{currentDate}</Text>
            <View style={styles.imageContainer}>
              {Object.keys(bowelImages).map((type, index) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleBowelTypeSelect(type)}
                  style={[
                    styles.imageWrapper,
                    selectedBowelType === type && styles.selectedImage,
                  ]}
                >
                  <Image source={bowelImages[type]} style={styles.image} />
                  <Text style={styles.imageLabel}>{`Type ${index + 1}`}</Text>
                  <Entypo
                    name="info-with-circle"
                    size={15}
                    color="white"
                    style={styles.infoIcon}
                    onPress={handleInfoPress}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Text style={styles.modalTitle}>Detaljer</Text>
            <Text style={styles.subtitle}>Udfyld afføringslogdetaljer</Text>
            <View style={styles.detailPageContainer}>
              <View style={styles.toggleContainer}>
                <Text style={styles.titleText}>
                  Smerter <Text style={styles.painText}>{pain}</Text>
                </Text>

                {/* Custom Slider with Gradient Background */}
                <LinearGradient
                  colors={["green", "yellow", "red"]} // Gradient from green to yellow to red
                  start={{ x: 0, y: 0 }} // Start from left (green)
                  end={{ x: 1, y: 0 }} // End at right (red)
                  style={styles.gradientBackground}
                >
                  <Slider
                    value={pain}
                    onValueChange={handleSliderChange}
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={10}
                    step={1}
                    minimumTrackTintColor="transparent" // Set track colors via gradient background
                    maximumTrackTintColor="transparent"
                    thumbTintColor="#ffffff"
                    animateTransitions={true} // Enable transitions for smoother animation
                    animationType="spring" // Adds a spring-like smooth animation
                    animationConfig={{
                      friction: 7, // Adjust friction for speed
                      tension: 10, // Adjust tension for responsiveness
                    }}
                  />
                </LinearGradient>

                {/* Display the intensity value at the center of the screen */}
                {showIntensity && currentIntensity !== null && (
                  <Text style={styles.centeredIntensity}>
                    {currentIntensity}
                  </Text>
                )}
              </View>

              <View style={styles.toggleContainer}>
                <Text style={styles.titleText}>Blod</Text>
                <SwitchToggle
                  switchOn={blood}
                  onPress={() => setBlood(!blood)}
                  backgroundColorOn="#017d0c"
                  backgroundColorOff="#960e0b"
                  circleColorOff="#c2c0bc"
                  circleColorOn="#ffffff"
                  containerStyle={{
                    width: 100,
                    height: 30,
                    borderRadius: 25,
                    padding: 5,
                  }}
                  circleStyle={{
                    width: 18,
                    height: 18,
                    borderRadius: 20,
                  }}
                />
              </View>

              {/* Hastende Toggle */}
              <View style={styles.toggleContainer}>
                <Text style={styles.titleText}>Hastende</Text>
                <SwitchToggle
                  switchOn={urgent}
                  onPress={() => setUrgent(!urgent)}
                  backgroundColorOn="#017d0c"
                  backgroundColorOff="#960e0b"
                  circleColorOff="#c2c0bc"
                  circleColorOn="#ffffff"
                  containerStyle={{
                    width: 100,
                    height: 30,
                    borderRadius: 25,
                    padding: 5,
                  }}
                  circleStyle={{
                    width: 18,
                    height: 18,
                    borderRadius: 20,
                  }}
                />
              </View>

              <TextInput
                style={styles.input}
                placeholder="Noter"
                multiline
                value={notes}
                onChangeText={setNotes}
              />

              <View style={styles.saveandbackbtn}>
                <TouchableOpacity
                  onPress={handleGoBack}
                  style={styles.backButton}
                >
                  <Text style={styles.backButtonText}>Tilbage</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSaveLog}
                  style={styles.saveButton}
                >
                  <Text style={styles.saveButtonText}>Gem Log</Text>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Info Modal */}
      <Modal
        isVisible={isInfoModalVisible}
        animationIn="zoomIn"
        animationOut="zoomOut"
        onBackdropPress={handleInfoModalClose}
        onRequestClose={handleInfoModalClose}
        backdropColor="rgba(0, 0, 0, 0.6)"
      >
        <View style={styles.infoModalContainer}>
          <Text>{infoText}</Text>
        </View>
      </Modal>
    </Modal>
  );
};

export default BowelModal;

const styles = StyleSheet.create({
  modal: {
    alignItems: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    width: "95%",
    flex: 1,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
    marginTop: 20,
    fontWeight: 400,
  },
  subtitle: {
    marginTop: 20,
    marginBottom: 10,
  },
  dateText: {
    fontSize: 24,
    fontWeight: "300",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginTop: 20,
  },
  imageWrapper: {
    margin: 10,
    borderWidth: 2,
    borderColor: "gray",
    borderRadius: 10,
    padding: 5,
    position: "relative",
  },
  selectedImage: {
    borderColor: "grey",
    borderWidth: 4,
  },
  image: {
    width: 110,
    height: 90,
    resizeMode: "center",
  },
  imageLabel: {
    fontSize: 12,
    fontWeight: "500",
    textAlign: "center",
  },
  infoIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    padding: 2,
  },
  infoModalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    width: "70%",
    justifyContent: "center",
  },
  arrowButton: {
    position: "absolute",
    bottom: 0,
    right: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    padding: 2,
    borderRadius: 30,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    width: "80%",
    height: 80,
  },
  toggleContainer: {
    width: "80%",
    height: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "space-between",
    marginVertical: 16,
    paddingHorizontal: 20,
  },
  titleText: {
    fontSize: 18, // Customize the font size as needed
    fontWeight: "300",
    color: "#333",
  },
  detailPageContainer: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    padding: 10,
    backgroundColor: "white",
    borderRadius: 20,
  },
  painText: {
    fontSize: 16, // Adjust the size for pain text
    fontWeight: "400",
    color: "#333",
  },
  slider: {
    height: 30,
  },
  gradientBackground: {
    width: "50%",
    height: 30,
    justifyContent: "center",
    borderRadius: 15,
  },
  centeredIntensity: {
    position: "absolute",
    top: "150%", // Center it vertically
    left: "42%",
    fontSize: 90,
    fontWeight: "bold",
    zIndex: 10,
    color: "rgba(0, 0, 0, 0.5)", // Semi-transparent black
    backgroundColor: "transparent", // Transparent background
  },
  saveandbackbtn: {
    flexDirection: "row",
  },
  saveButton: {
    backgroundColor: "#86C5D8",
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
    marginLeft: 10,
  },
  saveButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  backButton: {
    backgroundColor: "gray",
    padding: 15,
    borderRadius: 25,
    marginTop: 10,
  },
  backButtonText: {
    color: "white",
  },
});
