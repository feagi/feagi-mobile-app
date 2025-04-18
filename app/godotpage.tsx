import { Pressable, Text, View, StyleSheet, TouchableOpacity, ScrollView, Button, Image, TextInput, Alert, Animated, Modal } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, { useEffect, useRef, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import HelpModal from "./helpModal"; // Import the help

import { Accelerometer, Gyroscope } from 'expo-sensors';
import { Switch, GestureHandlerRootView } from 'react-native-gesture-handler';
import { Camera, CameraType, CameraView } from 'expo-camera';
import { sendData, initializeSocket } from './websocket';
import { Dimensions } from 'react-native';
import capabilities from '../constants/capabilities.js';


type CameraPermissionResponse = {
	status: 'granted' | 'denied' | 'undetermined';
	granted: boolean;
};

export default function GodotPage() {
	const [godot, onGodotChange] = useState('');
	const [menuVisible, setMenuVisible] = useState(false); // state for hamburger menu drop down
	const slideAnim = useRef(new Animated.Value(-250)).current; // Animation for sliding menu
	const [mobileSettingsModalVisible, setMobileSettingsModalVisible] = useState(false);
	const [isAccelerometerEnabled, setIsAccelerometerEnabled] = useState(false);
	const [isGyroscopeEnabled, setIsGyroscopeEnabled] = useState(false);
	let minAccel = { x: Infinity, y: Infinity, z: Infinity };
	let maxAccel = { x: -Infinity, y: -Infinity, z: -Infinity };
	let minGyro = { x: Infinity, y: Infinity, z: Infinity };
	let maxGyro = { x: -Infinity, y: -Infinity, z: -Infinity };
	//camera
	const cameraRef = useRef<Camera>(null);
	const [isCameraEnabled, setIsCameraEnabled] = useState(false);
	const [tempCameraEnable, setTempCameraEnable] = useState(false);
	const [permission, setPermission] = useState<CameraPermissionResponse | null>(null);

	const [lastFrame, setLastFrame] = useState<string | null>(null);

	const [isCameraMounted, setIsCameraMounted] = useState(false);
	const [facing, setFacing] = useState<CameraType>('front');
	const [frameIntervalId, setFrameIntervalId] = useState<NodeJS.Timeout | null>(null);


	//other
	const [tempAccelEnable, setTempAccelEnable] = useState(false);
	const [tempGyroEnable, setTempGyroEnable] = useState(false);


	const [currentOrientation, setCurrentOrientation] = useState('portrait');

	useEffect(() => {
		// Detect initial orientation
		const { width, height } = Dimensions.get('window');
		const initialOrientation = width > height ? 'landscape' : 'portrait';
		setCurrentOrientation(initialOrientation);

		// Listen for orientation changes
		const handleOrientationChange = ({ window }) => {
			const { width, height } = window;
			setCurrentOrientation(width > height ? 'landscape' : 'portrait');
		};

		// Add event listener
		const subscription = Dimensions.addEventListener('change', handleOrientationChange);

		// Cleanup
		return () => {
			subscription.remove();
		};
	}, []);

	// const [hasAccelerometerPermission, setHasAccelerometerPermission] = useState(false);
	useEffect(() => {
		initializeSocket();
		console.log('initializing socket');
	}, []);

	// const handleAccelPermission = async () => {
	// 	const { status: permissionStatus } = await Accelerometer.requestPermissionsAsync();

	// 	if (permissionStatus === 'granted') {
	// 		setHasAccelerometerPermission(true);
	// 	}
	// }

	const flipCamera = () => {
		setFacing(current => (current === 'back' ? 'front' : 'back'));
	};


	const updateSensoryData = async () => {
		setIsAccelerometerEnabled(tempAccelEnable);
		setIsGyroscopeEnabled(tempGyroEnable);
		setIsCameraEnabled(tempCameraEnable);
		if (tempAccelEnable) {
			// if (!Accelerometer.hasListeners()) {
			// 	Accelerometer.addListener(data => {
			// 		console.log('Accelerometer data:', data);
			// 		sendData(JSON.stringify(data));
			// 	});
			// 	Accelerometer.setUpdateInterval(1000);
			const sub = Accelerometer.addListener(data => {
				minAccel.x = Math.min(minAccel.x, data.x);
				minAccel.y = Math.min(minAccel.y, data.y);
				minAccel.z = Math.min(minAccel.z, data.z);

				maxAccel.x = Math.max(maxAccel.x, data.x);
				maxAccel.y = Math.max(maxAccel.y, data.y);
				maxAccel.z = Math.max(maxAccel.z, data.z);

				capabilities.capabilities.input.accelerometer[0].min_value = [minAccel.x, minAccel.y, minAccel.z,];
				capabilities.capabilities.input.accelerometer[0].max_value = [maxAccel.x, maxAccel.y, maxAccel.z,];

				capabilities.capabilities.input.accelerometer[0].disabled = false;
				// console.log(JSON.stringify(capabilities));
				sendData(JSON.stringify(capabilities));
			});
			Accelerometer.setUpdateInterval(1000);
			return () => sub.remove(); // Proper cleanup
		}

		if (tempGyroEnable && !Gyroscope.hasListeners()) {
			const sub = Gyroscope.addListener(data => {
				minGyro.x = Math.min(minGyro.x, data.x);
				minGyro.y = Math.min(minGyro.y, data.y);
				minGyro.z = Math.min(minGyro.z, data.z);

				maxGyro.x = Math.max(maxGyro.x, data.x);
				maxGyro.y = Math.max(maxGyro.y, data.y);
				maxGyro.z = Math.max(maxGyro.z, data.z);

				capabilities.capabilities.input.gyro[0].min_value = [minGyro.x, minGyro.y, minGyro.z,];
				capabilities.capabilities.input.gyro[0].max_value = [maxGyro.x, maxGyro.y, maxGyro.z,];

				capabilities.capabilities.input.gyro[0].disabled = false;
				// console.log(JSON.stringify(capabilities));
				sendData(JSON.stringify(capabilities));
			});
			Gyroscope.setUpdateInterval(1000);
			return () => sub.remove();
		}

		// Handle camera separately
		if (tempCameraEnable) {
			try {
				const { status } = await Camera.requestCameraPermissionsAsync();
				if (status === "granted") {
					setIsCameraEnabled(true);
					capabilities.capabilities.input.camera[0].disabled = false;

					// Optional: Update camera parameters if needed
					capabilities.capabilities.input.camera[0].threshold_default = 50; // Example
					capabilities.capabilities.input.camera[0].mirror = false;

					sendData(JSON.stringify(capabilities));
				}
			} catch (error) {
				console.error("Camera error:", error);
				capabilities.capabilities.input.camera[0].disabled = true;
				sendData(JSON.stringify(capabilities));
			}
		} else {
			capabilities.capabilities.input.camera[0].disabled = true;
			sendData(JSON.stringify(capabilities));
		}
	};

	//Ed added this
	//removed start camerafeed

	const stopCameraFeed = () => {
		setIsCameraEnabled(false);
		setIsCameraMounted(false);

		// Update capabilities (consistent with accelerometer/gyro approach)
		capabilities.capabilities.input.camera[0].disabled = true;
		sendData(JSON.stringify(capabilities));
	};

	const cancelSensoryData = () => {
		setTempAccelEnable(isAccelerometerEnabled);
		setTempGyroEnable(isGyroscopeEnabled);
		setTempCameraEnable(isCameraEnabled);
	}

	const [helpModalVisible, setHelpModalVisible] = useState(false); // State for Help Modal


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
					console.log("deleting: ");
					let key = store[i][0];
					let value = store[i][1];
					console.log("key: " + key + " Value: " + value);
					AsyncStorage.removeItem(key);
				});
			});
		});
	}

	const plugGodot = async () => {


		const value = await AsyncStorage.getItem("user");

		//AsyncStorage.getAllKeys((err, keys) => {
		//AsyncStorage.multiGet(keys, (err, stores) => {
		//stores.map((result, i, store) => {
		// get at each store's key/value so you can work with it

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

		//		});
		//	});
		//});


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

						<TouchableOpacity style={styles.menuItem} onPress={() => {
							router.push('/brainSettings');
							closeMenu();
						}}>
							<Ionicons name="bulb-outline" size={24} color="white" />
							<Text style={styles.menuItemText}>Brain Settings</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.menuItem} onPress={() => {
							router.push('/inputSettings');
							closeMenu();
						}}>
							<Ionicons name="enter-outline" size={24} color="white" />
							<Text style={styles.menuItemText}>Input Settings</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.menuItem} onPress={() => {
							router.push('/outputSettings');
							closeMenu();
						}}>
							<Ionicons name="log-out-outline" size={24} color="white" />
							<Text style={styles.menuItemText}>Output Settings</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.menuItem} onPress={() => { closeMenu(), setMobileSettingsModalVisible(true) }}>
							<Ionicons name="cog-outline" size={24} color="white" />
							<Text style={styles.menuItemText}>Mobile Settings</Text>
						</TouchableOpacity>

						<TouchableOpacity style={styles.menuItem} onPress={() => {
							router.push('/connectivitySettings');
							closeMenu();
						}}>
							<Ionicons name="wifi-outline" size={24} color="white" />
							<Text style={styles.menuItemText}>Connectivity</Text>
						</TouchableOpacity>

						<TouchableOpacity
							style={styles.menuItem}
							onPress={() => setHelpModalVisible(true)} // Show Help Modal
						>
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
				<HelpModal
					visible={helpModalVisible}
					onClose={() => setHelpModalVisible(false)} // Close the modal when clicked outside or the close button
				/>



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
					visible={mobileSettingsModalVisible}
					onOrientationChange={(orientation) => {
						setCurrentOrientation(orientation);
					}}
					supportedOrientations={['portrait', 'landscape']}
				>
					<View style={styles.modalOverlay}>
						<View style={styles.fixedModalContainer}>
							{/* Header section */}
							<View style={styles.modalHeader}>
								<Text style={styles.modalTitle}>Mobile Settings</Text>
								<TouchableOpacity
									style={styles.closeButton}
									onPress={() => setMobileSettingsModalVisible(false)}>
									<Ionicons name="close" size={24} color="#fff" />
								</TouchableOpacity>
							</View>

							<View style={styles.divider} />

							{/* Settings section */}
							<View style={styles.settingsWrapper}>
								<View style={styles.settingItem}>
									<Text style={styles.settingLabel}>Mobile Camera</Text>
									<Switch
										value={tempCameraEnable}
										onValueChange={(value) => setTempCameraEnable(value)}
										trackColor={{ false: '#767577', true: '#81D4FA' }}
										thumbColor={tempCameraEnable ? '#fff' : '#f4f3f4'}
									/>
								</View>

								<View style={styles.settingItem}>
									<Text style={styles.settingLabel}>Mobile Gyroscope</Text>
									<Switch
										value={tempGyroEnable}
										onValueChange={(value) => setTempGyroEnable(value)}
										trackColor={{ false: '#767577', true: '#81D4FA' }}
										thumbColor={tempGyroEnable ? '#fff' : '#f4f3f4'}
									/>
								</View>

								<View style={styles.settingItem}>
									<Text style={styles.settingLabel}>Mobile Accelerator</Text>
									<Switch
										value={tempAccelEnable}
										onValueChange={(value) => setTempAccelEnable(value)}
										trackColor={{ false: '#767577', true: '#81D4FA' }}
										thumbColor={tempAccelEnable ? '#fff' : '#f4f3f4'}
									/>
								</View>
							</View>

							{/* Button section */}
							<View style={styles.fixedButtonRow}>
								<TouchableOpacity
									style={styles.cancelButton}
									onPress={() => {
										cancelSensoryData();
										// setMobileSettingsModalVisible(false);
									}}>
									<Text style={styles.buttonText}>Cancel</Text>
								</TouchableOpacity>
								<TouchableOpacity
									style={styles.applyButton}
									onPress={() => {
										updateSensoryData();
										// setMobileSettingsModalVisible(false);
									}}>
									<Text style={styles.buttonText}>Apply</Text>
								</TouchableOpacity>
							</View>
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



						
						{isCameraEnabled && permission?.granted && (	
							<CameraView style={styles.cameraPreview} 
							facing={facing}
							// camera
							ref={cameraRef}>
								<TouchableOpacity
										style={styles.flipButton}
										onPress={flipCamera}
									>
										<Ionicons name="camera-reverse" size={24} color="white" />
									</TouchableOpacity>
							</CameraView>
						)} 
					
						

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
							injectedJavaScriptBeforeContentStart={`
								// Completely disable Web Audio API
								(function() {
								  const noop = () => {};
								  const mockAudioContext = {
									createAnalyser: () => ({}),
									createGain: () => ({}),
									suspend: () => Promise.resolve(),
									resume: () => Promise.resolve(),
									close: noop,
									state: 'closed',
									audioWorklet: {
									  addModule: () => Promise.resolve()
									}
								  };
								  
								  window.AudioContext = class {
									constructor() { return mockAudioContext; }
								  };
								  window.webkitAudioContext = window.AudioContext;
								  window.AudioWorkletNode = class {};
								  window.AudioWorkletProcessor = class {};
								  
								  // Prevent FEAGI audio initialization
								  window.FEAGI_AUDIO_DISABLED = true;
								})();
								true;
							  `}
						/>
						{lastFrame && (
							<View style={styles.framePreviewContainer}>
								<Image
									source={{ uri: lastFrame }}
									style={styles.framePreview}
									resizeMode="contain"
								/>
								<Text style={styles.frameDebugText}>
									Last frame: {new Date().toLocaleTimeString()}
								</Text>
							</View>
						)}

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
	cameraPreview: {
		position: 'absolute',
		width: 120,
		height: 160,
		right: 10,
		top: 10,
		zIndex: 100,
		borderRadius: 8,
		overflow: 'hidden',
		borderWidth: 2,
		borderColor: 'white'
	},//this is for camera
	flipButton: {
		position: 'absolute',
		bottom: 5,
		right: 5,
		backgroundColor: 'rgba(0,0,0,0.5)',
		borderRadius: 20,
		padding: 5
	  },
	button: {
		position: 'absolute', // Position the button absolutely
		bottom: 20, // Distance from the bottom of the screen
		alignSelf: 'center', // Center the button horizontally
		backgroundColor: '#007AFF', // Example background color
		padding: 10,
		borderRadius: 5,
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

	modalContainer: {
		backgroundColor: '#1e1e1e',
		borderRadius: 20,
		width: '95%',
		height: '80%',
	},

	modalText: {
		color: 'white'
	},

	modalOverlay: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		backgroundColor: 'rgba(0,0,0,0.5)',

	},

	fixedModalContainer: {
		width: '85%',
		backgroundColor: '#0A1A3A',
		borderRadius: 20,
		padding: 20,
		height: 'auto',
		minWidth: 250,
		minHeight: 250,
		maxWidth: 500,
		maxHeight: 400,
	},

	modalHeader: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 5,
	},

	modalTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		color: '#fff',
	},

	closeButton: {
		padding: 5,
	},

	closeButtonText: {
		fontSize: 20,
		fontWeight: 'bold',
		color: 'white',
	},

	divider: {
		height: 1,
		backgroundColor: '#555',
		marginBottom: 15,
		width: '100%',
	},

	settingsWrapper: {
		marginBottom: 20,
	},

	settingItem: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		paddingVertical: 12,
		marginBottom: 10,
		borderBottomWidth: 1,
		borderBottomColor: '#444',
	},

	settingLabel: {
		fontSize: 16,
		color: '#fff',
		flex: 1,
		marginRight: 10,
	},

	fixedButtonRow: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		marginTop: 10,
	},

	cancelButton: {
		backgroundColor: '#81D4FA',
		padding: 15,
		borderRadius: 10,
		flex: 1,
		marginRight: 10,
		alignItems: 'center',
	},

	applyButton: {
		backgroundColor: '#81D4FA',
		padding: 15,
		borderRadius: 10,
		flex: 1,
		marginLeft: 10,
		alignItems: 'center',
	},

	buttonText: {
		color: '#0A1A3A',
		fontSize: 18,
		fontWeight: 'bold',
	},
	framePreviewContainer: {
		position: 'absolute',
		bottom: 250,
		right: 20,
		width: 150,
		height: 200,
		backgroundColor: 'black',
		borderRadius: 8,
		zIndex: 200,
		borderWidth: 2,
		borderColor: 'white',
	},
	framePreview: {
		width: '100%',
		height: '100%',
	},
	frameDebugText: {
		position: 'absolute',
		bottom: -25,
		color: 'white',
		fontSize: 12,
		backgroundColor: 'rgba(0,0,0,0.5)',
	},
});