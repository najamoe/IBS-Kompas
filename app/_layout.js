import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Toast from 'react-native-toast-message';
import { Slot, Stack } from 'expo-router';

const _layout = () => {
  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
      
      </Stack>

      
      <Toast />
    </View>
  );
}

export default _layout

