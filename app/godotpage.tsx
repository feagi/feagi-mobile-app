import { Pressable, Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, Image, TextInput, Alert, Animated, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Switch, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Camera, useCameraPermissions } from 'expo-camera';
import { sendData, initializeSocket } from './websocket';

export default function GodotPage() {
	const [godot, onGodotChange] = useState('');
	const [menuVisible, setMenuVisible] = useState(false); // state for hamburger menu drop down
	const slideAnim = useRef(new Animated.Value(-250)).current; // Animation for sliding menu
	const [mobileSettingsModalVisible, setMobileSettingsModalVisible] = useState(false);
	const [isAccelerometerEnabled, setIsAccelerometerEnabled] = useState(false);
	const [isGyroscopeEnabled, setIsGyroscopeEnabled] = useState(false);
	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [tempAccelEnable, setTempAccelEnable] = useState(false);
	const [tempGyroEnable, setTempGyroEnable] = useState(false);
	const [tempCameraEnable, setTempCameraEnable] = useState(false);
	const [permission, requestPermission] = useCameraPermissions();
	// const [hasAccelerometerPermission, setHasAccelerometerPermission] = useState(false);

	useEffect (() => {
		initializeSocket();
	}, []);

	// const handleAccelPermission = async () => {
	// 	const { status: permissionStatus } = await Accelerometer.requestPermissionsAsync();

	// 	if (permissionStatus === 'granted') {
	// 		setHasAccelerometerPermission(true);
	// 	}
	// }

	const updateSensoryData = () => {
		setIsAccelerometerEnabled(tempAccelEnable);
		setIsGyroscopeEnabled(tempGyroEnable);
		setIsCameraEnabled(tempCameraEnable);
		if (tempAccelEnable) {
			if (!Accelerometer.hasListeners()) {
				Accelerometer.addListener(data => {
					console.log('Accelerometer data:', data);
					sendData(JSON.stringify(data));
				});
				Accelerometer.setUpdateInterval(1000);
			}
		// } else if (tempAccelEnable && !hasAccelerometerPermission) {
		// 	handleAccelPermission();
		} else {
			Accelerometer.removeAllListeners();
		}
		if (tempGyroEnable) {
			if (!Gyroscope.hasListeners()) {
				Gyroscope.addListener(data => {
					console.log('Gyroscope data:', data);
					sendData(JSON.stringify(data));
				});
				Gyroscope.setUpdateInterval(1000);
			}
		} else {
			Gyroscope.removeAllListeners();
		}
		if (tempCameraEnable) {
			if (!permission?.granted) {
				requestPermission();
				updateSensoryData();
			}
			else {
				console.log("Camera is activated");
			}
		} else {
		}
	};

	const cancelSensoryData = () => {
		setTempAccelEnable(isAccelerometerEnabled);
		setTempGyroEnable(isGyroscopeEnabled);
		setTempCameraEnable(isCameraEnabled);
	}

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
		<GestureHandlerRootView>

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
					<ScrollView contentContainerStyle={styles.menuScrollContainer}>
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

						<TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(), setMobileSettingsModalVisible(true) }}>
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
					</ScrollView>
				</Animated.View>

				{/* close the menu when clicking outside */}
				{menuVisible && (
					<TouchableOpacity
						style={styles.overlay}
						activeOpacity={1}
						onPress={closeMenu}
					/>
				)}

				<Modal
					animationType="slide"
					transparent={true}
					visible={mobileSettingsModalVisible}>

					<View style={styles.modalOverlay}>
						<View style={styles.modalContainer}>
							<Text style={styles.modalTitle}>Mobile Settings</Text>
							<TouchableOpacity onPress={() => setMobileSettingsModalVisible(false)}>
								<Text style={styles.modalText}>X</Text>
							</TouchableOpacity>
							<Text style={styles.modalText}>Mobile Accelerator</Text>
							<Switch value={tempAccelEnable} onValueChange={(value) => { setTempAccelEnable(value) }}></Switch>
							<Text style={styles.modalText}>Mobile Gyroscope</Text>
							<Switch value={tempGyroEnable} onValueChange={(value) => { setTempGyroEnable(value) }}></Switch>
							<Text style={styles.modalText}>Mobile Camera</Text>
							<Switch value={tempCameraEnable} onValueChange={(value) => { setTempCameraEnable(value) }}></Switch>
							<TouchableOpacity onPress={cancelSensoryData}>
								<Text style={styles.modalText}>Cancel</Text>
							</TouchableOpacity>
							<TouchableOpacity onPress={updateSensoryData}>
								<Text style={styles.modalText}>Apply</Text>
							</TouchableOpacity>
						</View>
					</View>
				</Modal>

				<ScrollView style={{ flex: 1 }}>
					<View style={{ height: 600 }}>
						{/* Hamburger Menu Button */}
						<TouchableOpacity
							style={styles.menuButton}
							onPress={toggleMenu}
						>
							<Ionicons name="menu" size={32} color="black" />
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
		</GestureHandlerRootView>
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
	menuScrollContainer: {
		flexGrow: 1,
		paddingBottom: 20,
	},
	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',

	},
	modalContainer: {
		backgroundColor: '#1e1e1e',
		borderRadius: 20,
		width: '95%',
		height: '80%',
	},
	modalTitle: {
		textAlign: 'center',
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
		padding: 10,
		marginTop: 10,
	},
	modalText: {
		color: 'white'
	},
});