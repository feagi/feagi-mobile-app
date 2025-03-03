import { Pressable, Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, { useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function GodotPage() {
	const [godot, onGodotChange] = useState('');


	const deleteKeys = () => {
		AsyncStorage.getAllKeys((err, keys) => {
			AsyncStorage.multiGet(keys, (err, stores) => {
				stores.map((result, i, store) => {
					// get at each store's key/value so you can work with it
					let key = store[i][0];
					let value = store[i][1];
					console.log("key: " + key + " Value: " + value);
					AsyncStorage.removeItem(key);
	         });
	       });
	   });


	}



	const plugGodot = () => {
    		AsyncStorage.getAllKeys((err, keys) => {
    			AsyncStorage.multiGet(keys, (err, stores) => {
    				stores.map((result, i, store) => {
    					// get at each store's key/value so you can work with it
    					let key = store[i][0];
    					let value = store[i][1];

						let httpsLink = value;
						let concatLink = httpsLink.slice(8);
						let wssLink = value.replace('https', 'wss');
						console.log("reg: " + httpsLink);
						console.log("concat: " + concatLink);
						console.log("wss: " + wssLink);
						//8
    					let godotLink = ("https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=" + concatLink + "&port_disabled=true&websocket_url=" + wssLink + "/p9055&http_type=HTTPS://");
    					console.log("got: " + godotLink);
    					onGodotChange(godotLink);
    					//https://user-pmcmwytxjfjfvjncvjkb-feagi.feagi-k8s-production.neurorobotics.studio
                        //"https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio/p9055&http_type=HTTPS://",

    					//return godotLink;

    	         });
    	       });
    	   });


    	}

	useEffect(() => {
		plugGodot();

		}, [])


  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ height: 600 }}>
        <WebView
          //source={require("../assets/feagi/index.html")}
          source={{
            uri: godot,
           }}
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

		<TouchableOpacity
        	        style={[styles.button, {margin:50}]}
        	        onPress={() => deleteKeys()} // Navigate to corticalControl page
        	        >
        	        <Text style={styles.buttonText}>Delete Keys</Text>
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
