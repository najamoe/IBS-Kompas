// app/components/modal/waterModal.js
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import React from 'react';

const WaterModal = ({ isVisible, onClose, onAddWater }) => {
  return (
    <Modal
      transparent={true}
      animationType="slide"
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text>Add Water Intake</Text>
          <TouchableOpacity onPress={onAddWater}>
            <Text>Add 2 dl</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose}>
            <Text>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
};

export default WaterModal;
