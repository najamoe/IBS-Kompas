import React, { useState } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image } from "react-native";
import Modal from "react-native-modal";
import Swiper from "react-native-swiper";
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

  const [selectedBowelType, setSelectedBowelType] = useState(null);
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false); // State to control modal visibility
  const [infoText, setInfoText] = useState("");

  const handleInfoPress = () => {
    setIsInfoModalVisible(true); // Show the modal when the info icon is pressed
  };

  const handleInfoModalClose = () => {
    setIsInfoModalVisible(false); // Close the modal
  };

  const handleBowelTypeSelect = (type) => {
    setSelectedBowelType(type);
    console.log(`Selected bowel type: ${type}`); // Log the selected type
  };

  // Mapping of bowel types to images
  const bowelImages = {
    type1,
    type2,
    type3,
    type4,
    type5,
    type6,
    type7
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
        <Text style={styles.modalTitle}>Afførings-dagbog</Text>

        {/* Swiper for paginated pages */}
        <Swiper
          style={styles.swiper}
          showsPagination={true}
          loop={false}
          scrollEnabled={true} 
        >
          {/* First Page with images to choose from */}
          <View style={styles.page}>
            <Text style={styles.dateText}>{currentDate}</Text>
           
            {/* Display 7 images as selectable options */}
            <View style={styles.imageContainer}>
              {Object.keys(bowelImages).map((type) => (
                <TouchableOpacity
                  key={type}
                  onPress={() => handleBowelTypeSelect(type)}
                  style={[
                    styles.imageWrapper,
                    selectedBowelType === type && styles.selectedImage,
                  ]}
                >
                  <Image source={bowelImages[type]} style={styles.image} />
                  {/* Info Icon on Top Right of Image */}
                  <Entypo
                    name="info-with-circle"
                    size={15}
                    color="white"
                    onPress={handleInfoPress}
                    style={styles.infoIcon}
                  />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.page}>
            <Text style={styles.pageText}>Second Page Content</Text>
            {/* Buttons for saving or canceling */}
            <View style={styles.exitButtonContainer}>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.exitButton}>Afbryd</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.saveButton}>Gem</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.page}>
            <Text style={styles.pageText}>Third Page Content</Text>
          </View>
        </Swiper>
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
          <Text style={styles.infoText}>{infoText || "No information available."}</Text>
        </View>
      </Modal>
    </Modal>
  );
};

export default BowelModal;

const styles = StyleSheet.create({
  modal: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  container: {
    backgroundColor: "white",
    opacity: 1,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    flex: 1, 
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "400",
  },
  dateText: {
    fontSize: 24,
    fontWeight: "300",
  },
  swiper: {
    width: "100%",
    marginTop: 15,
  },
  page: {
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  pageText: {
    fontSize: 20,
    textAlign: "center",
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
    borderColor: "grey", // Highlight the selected image with a border color
    borderWidth: 4,
  },
  image: {
    width: 90,
    height: 90,
    resizeMode:"center",
  },
  infoIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background for the icon
    borderRadius: 15,
    padding: 5,
  },
  infoModalContainer: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  infoText: {
    fontSize: 18,
    color: "black",
    marginBottom: 15,
  },

  saveButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    marginLeft: 10,
  },
  exitButton: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 5,
    marginRight: 10,
  },
  exitButtonContainer: {
    flexDirection: "row",
    marginTop: 20,
  },
});
