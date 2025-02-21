import { Pressable, Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from "react"

export default function BrainMoitor() {
  return (

    <View style={styles.container}>

      <Text style={[styles.text, {marginBottom: 10}]}>This is a placeholder for the brain monitor screen</Text>


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