import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Importing Ionicons from Expo vector icons

const CustomButton = ({ title, handlePress, containerStyles, textStyles, isLoading, iconName }) => {
  return (
    <TouchableOpacity
      style={[styles.button, containerStyles, isLoading && styles.loading]} 
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading} 
    >
      <View style={styles.buttonContent}>
        {iconName && (
          <Ionicons name={iconName} size={20} color="white" style={styles.icon} /> // Icon with size and color
        )}
        <Text style={[styles.buttonText, textStyles]}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#86c5d8',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 30,
    marginBottom: 20,
    alignItems: 'center',
    justifyContent: 'center',
    width: 200,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8, // Space between icon and text
  },
  loading: {
    opacity: 0.5, 
  },
  buttonContent: {
    flexDirection: 'row', // Layout for icon and text (horizontal)
    alignItems: 'center', // Vertically center both
  },
  icon: {
    marginRight: 8, // Space between icon and text
  },
});
