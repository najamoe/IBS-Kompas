import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { Tabs, Redirect } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const TabIcon = ({ name, color, size }) => {
    return <FontAwesome name={name} color={color} size={size} />;
  };

const TabsLayout = () => {
  return (
  <>
  <Tabs
        screenOptions={{
            tabBarActiveTintColor: '#86c5d8',
            tabBarInactiveTintColor: '#CDCDE0',
            tabBarStyle:{
                backgroundColor: '#F0F8FF',
                borderTopWidth: 1,
                borderTopColor: '#C3C8CC',
                height: 55,
                
            },
            tabBarLabelStyle:{
                fontSize: 12,
                fontWeight: 'bold',
            }
        }}
  >

    <Tabs.Screen 
    name="home"
    options={{
        title: 'Hjem',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
            <TabIcon 
            name={ focused ? 'home' : 'home'} 
            color={color} 
            size={24}
            />
        )
    }}
    />
    <Tabs.Screen 
    name="insert"
    options={{
        title: 'tilføj',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
            <TabIcon 
            name={ focused ? 'plus' : 'plus'} 
            color={color} 
            size={24}
            />
        )
    }}
    />
   
    <Tabs.Screen 
    name="stats"
    options={{
        title: 'Statistik',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
            <TabIcon 
            name={ focused ? 'calendar' : 'calendar'} 
            color={color} 
            size={24}
            />
        )
    }}
    />
     <Tabs.Screen 
    name="profile"
    options={{
        title: 'Profil',
        headerShown: false,
        tabBarIcon: ({ color, focused}) => (
            <TabIcon 
            name={ focused ? 'user' : 'user'} 
            color={color} 
            size={24}
            />
        )
    }}
    />

  </Tabs>
  </>
  )
}

export default TabsLayout

const styles = StyleSheet.create({})