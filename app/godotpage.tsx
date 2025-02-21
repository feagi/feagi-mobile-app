import { Pressable, Text, View, StyleSheet, TouchableOpacity, ThemedText, ScrollView, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, {useEffect, useState} from "react"


export default function GodotPage() {

	return(
		<ScrollView style={{ height: 600}}>

        <View style={{ height: 600 }}>
		<WebView
				//source={require("../assets/feagi/index.html")}
	              source={{
					  uri: "https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-upxdlwiwqopnljbtpbiq-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-upxdlwiwqopnljbtpbiq-feagi.feagi-k8s-production.neurorobotics.studio/p9050&http_type=HTTPS://",
					  }}
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

			</View>
		</ScrollView>

	    );


}

export default GodotPage
