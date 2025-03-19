import { Pressable, Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, Image, TextInput, Alert, Animated } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function GodotPage() {
	const [godot, onGodotChange] = useState('');
	const [menuVisible, setMenuVisible] = useState(false); // state for hamburger menu drop down
	const slideAnim = useRef(new Animated.Value(-250)).current; // Animation for sliding menu

	// Toggle the dropdown menu
	const toggleMenu = () => {
		if (menuVisible) {
			// Slide out
			Animated.timing(slideAnim, {
				toValue: -250,
				duration: 300,
				useNativeDriver: true,
			}).start();
		} else {
			// Slide in
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 300,
				useNativeDriver: true,
			}).start();
		}
		setMenuVisible(!menuVisible);
	};

	//close the dropdown menu when clicking outside 
	const closeMenu = () => {
		if (menuVisible) {
			Animated.timing(slideAnim, {
				toValue: -250,
				duration: 300,
				useNativeDriver: true,
			}).start();
			setMenuVisible(false);
		}
	}

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
		<View style={{ flex: 1 }}>
			{/* Dropdown Menu */}
			<Animated.View
				style={[
					styles.menuContainer,
					{
						transform: [{ translateX: slideAnim }],
					},
				]}
			>
				<TouchableOpacity
					style={styles.menuItem}
					onPress={() => {
						router.push('/corticalControl');
						closeMenu();
					}}
				>
					<Ionicons name="hand-left-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Cortical Controls</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={() => { }}>
					<Ionicons name="bulb-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Brain Settings</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={() => { }}>
					<Ionicons name="enter-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Input Settings</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={() => { }}>
					<Ionicons name="log-out-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Output Settings</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={() => { }}>
					<Ionicons name="cog-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Mobile Settings</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={() => { }}>
					<Ionicons name="wifi-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Connectivity</Text>
				</TouchableOpacity>

				<TouchableOpacity style={styles.menuItem} onPress={() => { }}>
					<Ionicons name="help-outline" size={24} color="white" />
					<Text style={styles.menuItemText}>Help</Text>
				</TouchableOpacity>
			</Animated.View>

			{/* close the menu when clicking outside */}
			{menuVisible && (
				<TouchableOpacity
					style={styles.overlay}
					activeOpacity={1}
					onPress={closeMenu}
				/>
			)}

			<ScrollView style={{ flex: 1 }}>
				<View style={{ height: 600 }}>
					{/* Hamburger Menu Button */}
					<TouchableOpacity
						style={styles.menuButton}
						onPress={toggleMenu}
					>
						<Ionicons name="menu" size={32} color="white" />
					</TouchableOpacity>

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

					<TouchableOpacity
						style={[styles.button, { margin: 50 }]}
						onPress={() => deleteKeys()}
					>
						<Text style={styles.buttonText}>Delete Keys</Text>
					</TouchableOpacity>
				</View>
			</ScrollView>
		</View>
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
	menuButton: {
		position: 'absolute',
		top: 20,
		left: 20,
		zIndex: 1,
	},
	menuContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		width: 250,
		height: '100%',
		backgroundColor: '#2e2e2e',
		paddingTop: 50,
		zIndex: 2,
	},
	menuItem: {
		flexDirection: 'row',
		alignItems: 'center',
		padding: 15,
		borderBottomWidth: 1,
		borderBottomColor: '#555',
	},
	menuItemText: {
		color: 'white',
		fontSize: 18,
		marginLeft: 10,
	},
	overlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		backgroundColor: 'rgba(0, 0, 0, 0.5)',
		zIndex: 1,
	},
});