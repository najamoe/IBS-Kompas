import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import Modal from "react-native-modal";
import { editBowelLog } from "../../services/firebase/bowelService";

const BowelEditModal = () => {
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
    <Text> test bowel edit modal</Text>

    </View>
  </Modal>;
};

export default BowelEditModal;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 20,
    alignItems: "center",
    width: "95%",
    flex: 1,
  },
});
