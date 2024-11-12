import { StyleSheet, Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from "react-native-safe-area-context";
import React from 'react'

const stats = () => {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={{ height: "100%" }}>
        <Text>STATS</Text>
      </ScrollView>
    </SafeAreaView>
  )
}

export default stats

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#cae9f5",
    alignItems: "center",
    justifyContent: "center",
  },
})