import React from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';

export default function BrainUnpluggedScreen() {
  return (
    <View style={styles.container}>
      {/* Brain image */}
      <Image
        source={require('../assets/images/placeholder.png')}
        style={styles.brainImage}
        resizeMode="contain"
      />

      {/* Main text */}
      <Text style={styles.title}>Brain is unplugged</Text>

      {/* "Plug In" button */}
      <Pressable style={styles.button} onPress={() => console.log("Plug In tapped!")}>
        <Text style={styles.buttonText}>Plug In</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  text: {
    fontFamily: "SpaceMono-Regular"
  },
  container: {
    flex: 1,
    backgroundColor: '#0D0D0D',  // Black background
    alignItems: 'center',
    justifyContent: 'center',
  },
  brainImage: {
    width: 150,
    height: 150,
    marginBottom: 30,
  },
  title: {
    color: '#FFFFFF',            // White text
    fontSize: 24,
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1E90FF',  // Blue button (change as needed)
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',            // White text for button
    fontSize: 18,
  },
});

export default BrainUnpluggedScreen