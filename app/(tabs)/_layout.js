import { StatusBar } from "react-native";
import React from "react";
import { Tabs, Redirect } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Entypo } from "@expo/vector-icons";

const TabIcon = ({ name, color, size, iconType }) => {
  if (iconType === "font-awesome") {
    return <FontAwesome name={name} color={color} size={size} />;
  }
  return <Entypo name={name} color={color} size={size} />;
};

const TabsLayout = () => {
  return (
    <>
     <StatusBar backgroundColor="#ffffff" style="light" />
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
            borderRadius: 30,
            marginHorizontal: 10,
            width: "90%", 
            alignSelf: "center", 
            position: "absolute",
            bottom: 4, // Adjust for bottom spacing
           marginLeft: 20,
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
};

export default TabsLayout;
