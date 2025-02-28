import { Pressable, Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, { useEffect, useState } from "react";

export default function GodotPage() {
  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ height: 600 }}>
        <WebView
          //source={require("../assets/feagi/index.html")}
          source={{
            uri: "https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio/p9055&http_type=HTTPS://",          
            // }}
          //uri: "https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio/p9055&http_type=HTTPS://",
          //https://user-upxdlwiwqopnljbtpbiq-feagi.feagi-k8s-production.neurorobotics.studio
          // ❗ NOTE: The below values are in place to be ultra-permissive to pinpoint display/interaction issues. They should be altered/eliminated where unneeded
          //source={require("../assets/feagi/index.html")}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          mediaPlaybackRequiresUserAction={false}
          scalesPageToFit={true}
          bounces={false}
        />

        {/* Cortical Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/corticalControl')} // Navigate to corticalControl page
        >
          <Text style={styles.buttonText}>Go to Cortical Controls</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    position: 'absolute', // Position the button absolutely
    bottom: 20, // Distance from the bottom of the screen
    alignSelf: 'center', // Center the button horizontally
    backgroundColor: '#007AFF', // Example background color
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#FFFFFF', // Example text color
    fontSize: 16,
  },
});
