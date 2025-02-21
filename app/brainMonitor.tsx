import { Pressable, Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from "react"
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const MyDrawer = () => {
  return (
    <Drawer.Navigator screenOptions={{drawerPosition: 'right'}}>
      <Drawer.Screen name="plugin" component={"/plugin"}></Drawer.Screen>
      <Drawer.Screen name="index" component={"/index"}></Drawer.Screen>
    </Drawer.Navigator>
  );
}

export default function BrainMoitor() {
  return (

    <View style={styles.container}>

      <Text style={[styles.text, {marginBottom: 10}]}>This is a placeholder for the brain monitor screen</Text>

      <NavigationContainer>
        <Drawer.Navigator screenOptions={{drawerPosition: 'left'}}>
          <Drawer.Screen name="corticalControls" component={""}></Drawer.Screen>
          <Drawer.Screen name="BrainSettings" component={""}></Drawer.Screen>
          <Drawer.Screen name="inputSettings" component={""}></Drawer.Screen>
          <Drawer.Screen name="outputSettings" component={""}></Drawer.Screen>
          <Drawer.Screen name="mobileSettings" component={""}></Drawer.Screen>
          <Drawer.Screen name="connectivity" component={""}></Drawer.Screen>
          <Drawer.Screen name="help" component={""}></Drawer.Screen>
        </Drawer.Navigator>
    </NavigationContainer>


    </View>
  );



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#151B54",
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontFamily: "SpaceMono-Regular"
  }
});


export default BrainMoitor