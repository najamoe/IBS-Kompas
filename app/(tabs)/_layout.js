import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Entypo } from '@expo/vector-icons';

const TabIcon = ({ name, color, size, iconType }) => {
     if (iconType === "font-awesome") {
       return <FontAwesome name={name} color={color} size={size} />;
     }
     return <Entypo name={name} color={color} size={size} />;
  };

const TabsLayout = () => {
  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#86c5d8",
          tabBarInactiveTintColor: "#CDCDE0",
          tabBarStyle: {
            backgroundColor: "#F0F8FF",
            borderTopWidth: 1,
            borderTopColor: "#C3C8CC",
            height: 60,
            borderRadius: 20, // Add rounded corners
            marginHorizontal: 15, // Create space around the tab bar
            width: "95%", // Adjust the width
            alignSelf: "center", // Center the tab bar
            position: "absolute", // Float the tab bar
            bottom: 10, // Distance from the bottom
            elevation: 5, // Shadow for Android
            shadowColor: "#000", // Shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 5,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "bold",
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Hjem",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? "home" : "home"}
                color={color}
                size={24}
                iconType="font-awesome"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="insert"
          options={{
            title: "tilføj",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? "plus" : "plus"}
                color={color}
                size={22}
                iconType="font-awesome"
              />
            ),
          }}
        />

        <Tabs.Screen
          name="stats"
          options={{
            title: "Statistik",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? "bar-graph" : "bar-graph"}
                color={color}
                size={22}
                iconType="entypo"
              />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: "Profil",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon
                name={focused ? "user" : "user"}
                color={color}
                size={22}
                iconType="font-awesome"
              />
            ),
          }}
        />
      </Tabs>
    </>
  );
}

export default TabsLayout

const styles = StyleSheet.create({})