import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const wellnessChart = () => {
  return (
    <View style={styles.chartContainer}>
      <Text style={styles.title}>Humør</Text>
      
    </View>
  )
}

export default wellnessChart

const styles = StyleSheet.create({
  chartContainer: {  
    marginTop: 200,
    backgroundColor: "white",
    borderRadius: 10,
    width: "96%",
    height: 300,
    marginVertical: 10,
    marginLeft: "3%", 
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
})