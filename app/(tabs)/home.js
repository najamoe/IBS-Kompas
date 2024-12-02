import { StyleSheet, RefreshControl, Text, View, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import React from "react";

const home = () => { 
  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 200);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#cae9f5", "white"]} style={styles.gradient}>
      <ScrollView
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >


          <Text>home</Text>


          
          <Toast />
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
});
