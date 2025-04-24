import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Accelerometer,
  AccelerometerMeasurement,
  Gyroscope,
  GyroscopeMeasurement,
} from "expo-sensors";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { compress } from "lz4js";
import capabilities from "../constants/capabilities.js";
import { WebSocketManager } from "./websocket";
import { getASCII } from "../utils/littleHelpers.js";
import MobileSettings from "@/components/MobileSettings.js";
import HamburgerMenu from "@/components/HamburgerMenu.js";
import Webcam from "@/components/Webcam.js";

export default function GodotPage() {
  const [godot, onGodotChange] = useState("");
  const [menuVisible, setMenuVisible] = useState(false); // hamburger menu
  const slideAnim = useRef(new Animated.Value(-250)).current; // Animation for sliding menu
  const [mobileSettingsModalVisible, setMobileSettingsModalVisible] =
    useState(false);
  const [currentOrientation, setCurrentOrientation] = useState("portrait");
  // websocket
  const wsMgr = useRef<WebSocketManager | null>(null);
  // camera
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [tempCameraEnable, setTempCameraEnable] = useState(false);
  const [enabledInputs, setEnabledInputs] = useState({
    camera: { visual: false, actual: false },
  });
  // gyro / accelerometer
  const [isAccelerometerEnabled, setIsAccelerometerEnabled] = useState(false);
  const [isGyroscopeEnabled, setIsGyroscopeEnabled] = useState(false);
  const [tempAccelEnable, setTempAccelEnable] = useState(false);
  const [tempGyroEnable, setTempGyroEnable] = useState(false);
  const gyroASCII = getASCII("rawGYR");
  const accelerometerASCII = getASCII("rawACC");
  // let minAccel = { x: Infinity, y: Infinity, z: Infinity };
  // let maxAccel = { x: -Infinity, y: -Infinity, z: -Infinity };
  // let minGyro = { x: Infinity, y: Infinity, z: Infinity };
  // let maxGyro = { x: -Infinity, y: -Infinity, z: -Infinity };

  // Get FEAGI URL
  useEffect(() => {
    const plugGodot = async () => {
      // AsyncStorage.getAllKeys((err, keys) => {
      // AsyncStorage.multiGet(keys, (err, stores) => {
      // stores.map((result, i, store) => {
      // get at each store's key/value so you can work with it
      const value = await AsyncStorage.getItem("user");
      const concatLink = value?.slice(8);
      const wssLink = value?.replace("https", "wss");
      const godotLink = `https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=${concatLink}&port_disabled=true&websocket_url=${wssLink}/p9055&http_type=HTTPS://`;
      console.log("godotLink: " + godotLink);
      onGodotChange(godotLink);
    };

    plugGodot();
  }, []);

  // Landscape / portrait orientation
  useEffect(() => {
    // Detect initial orientation
    const { width, height } = Dimensions.get("window");
    const initialOrientation = width > height ? "landscape" : "portrait";
    setCurrentOrientation(initialOrientation);

    // Listen for orientation changes
    const handleOrientationChange = ({
      window,
    }: {
      window: { width: number; height: number };
    }) => {
      const { width, height } = window;
      setCurrentOrientation(width > height ? "landscape" : "portrait");
    };

    // Add event listener
    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    // Cleanup
    return () => {
      subscription.remove();
    };
  }, []);

  // const [hasAccelerometerPermission, setHasAccelerometerPermission] = useState(false);
  //   useEffect(() => {
  //     initializeSocket(capabilities);
  //     console.log("initializing socket");
  //   }, []);

  // const handleAccelPermission = async () => {
  // 	const { status: permissionStatus } = await Accelerometer.requestPermissionsAsync();
  // 	if (permissionStatus === 'granted') {
  // 		setHasAccelerometerPermission(true);
  // 	}
  // }
  //

  // const updateCapabilities = (type: string, data) => {
  //   minGyro.x = Math.min(minGyro.x, data.x);
  //   minGyro.y = Math.min(minGyro.y, data.y);
  //   minGyro.z = Math.min(minGyro.z, data.z);

  //   maxGyro.x = Math.max(maxGyro.x, data.x);
  //   maxGyro.y = Math.max(maxGyro.y, data.y);
  //   maxGyro.z = Math.max(maxGyro.z, data.z);

  //   if (type === "gyro") {
  //     //   capabilities.capabilities.input.gyro[0].min_value = [
  //     //     minGyro.x,
  //     //     minGyro.y,
  //     //     minGyro.z,
  //     //   ];
  //     //   capabilities.capabilities.input.gyro[0].max_value = [
  //     //     maxGyro.x,
  //     //     maxGyro.y,
  //     //     maxGyro.z,
  //     //   ];
  //   } else {
  //     // capabilities.capabilities.input.accelerometer[0].min_value = [
  //     //   minAccel.x,
  //     //   minAccel.y,
  //     //   minAccel.z,
  //     // ];
  //     // capabilities.capabilities.input.accelerometer[0].max_value = [
  //     //   maxAccel.x,
  //     //   maxAccel.y,
  //     //   maxAccel.z,
  //     // ];
  //   }
  // };

  const formatAccGyroData = (
    data: AccelerometerMeasurement | GyroscopeMeasurement,
    type: string
  ) => {
    const formatted = [
      ...(type === "acc" ? accelerometerASCII : gyroASCII),
      12, // width/length
      0, // height (N/A here)
      0,
      0,
      0,
      data.x,
      1,
      0,
      0,
      data.y,
      2,
      0,
      0,
      data.z,
    ];

    const compressed = compress(
      new TextEncoder().encode(JSON.stringify(formatted))
    );

    return compressed;
  };

  useEffect(() => {
    async function letsGetItStarted() {
      if (isAccelerometerEnabled || isGyroscopeEnabled || isCameraEnabled) {
        console.log("initializing ws");
        if (!wsMgr.current) wsMgr.current = new WebSocketManager(capabilities);
        await wsMgr.current.initialize();
      }
    }

    letsGetItStarted();

    if (isAccelerometerEnabled && !Accelerometer.hasListeners()) {
      Accelerometer.setUpdateInterval(1000);
      capabilities.capabilities.input.accelerometer[0].disabled = false;

      Accelerometer.addListener((data) => {
        // console.log("ACCELEROMETER DATA:", data);
        if (!wsMgr.current) {
          console.error(
            "No websocket found. Skipping sending accelerometer data."
          );
          return;
        }
        if (!data?.x) {
          console.error(
            "Got accelerometer data, but it doesn't have an x value:",
            data
          );
          return;
        }

        const compressed = formatAccGyroData(data, "acc");
        wsMgr.current?.send(compressed);
      });

      // return () => sub.remove(); // Proper cleanup
    } else if (!isAccelerometerEnabled && Accelerometer.hasListeners()) {
      Accelerometer.removeAllListeners();
      capabilities.capabilities.input.accelerometer[0].disabled = true;
    }
    // else if (!isAccelerometerEnabled && !hasAccelerometerPermission) {
    // handleAccelPermission();
    // }

    if (isGyroscopeEnabled && !Gyroscope.hasListeners()) {
      Gyroscope.setUpdateInterval(1000);
      capabilities.capabilities.input.gyro[0].disabled = false;

      Gyroscope.addListener((data) => {
        // console.log("GYROSCOPE DATA:", data);
        if (!wsMgr.current) {
          console.error("No websocket found. Skipping sending gyro data.");
          return;
        }
        if (!data?.x) {
          console.error("Got gyro data, but it doesn't have an x value:", data);
          return;
        }
        const compressed = formatAccGyroData(data, "gyro");
        wsMgr.current?.send(compressed);
      });
    } else if (!isGyroscopeEnabled && Gyroscope.hasListeners()) {
      Gyroscope.removeAllListeners();
      capabilities.capabilities.input.gyro[0].disabled = true;
    }
  }, [isAccelerometerEnabled, isGyroscopeEnabled, isCameraEnabled]);

  const updateSensoryData = () => {
    setIsAccelerometerEnabled(tempAccelEnable);
    setIsGyroscopeEnabled(tempGyroEnable);
    setIsCameraEnabled(tempCameraEnable);
  };

  const cancelSensoryData = () => {
    setTempAccelEnable(isAccelerometerEnabled);
    setTempGyroEnable(isGyroscopeEnabled);
    setTempCameraEnable(isCameraEnabled);
    setMobileSettingsModalVisible(false);
  };

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

  return (
    <GestureHandlerRootView>
      <View style={{ flex: 1 }}>
        <HamburgerMenu
          menuVisible={menuVisible}
          setMenuVisible={setMenuVisible}
          setMobileSettingsModalVisible={setMobileSettingsModalVisible}
          slideAnim={slideAnim}
        />

        <MobileSettings
          tempAccelEnable={tempAccelEnable}
          setTempAccelEnable={setTempAccelEnable}
          tempCameraEnable={tempCameraEnable}
          setTempCameraEnable={setTempCameraEnable}
          tempGyroEnable={tempGyroEnable}
          setTempGyroEnable={setTempGyroEnable}
          cancelSensoryData={cancelSensoryData}
          updateSensoryData={updateSensoryData}
          mobileSettingsModalVisible={mobileSettingsModalVisible}
          setMobileSettingsModalVisible={setMobileSettingsModalVisible}
        />

        <ScrollView style={{ flex: 1 }}>
          <View style={{ height: 600 }}>
            {/* Hamburger Menu Button */}
            <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
              <Ionicons
                name="menu"
                size={64}
                color="black"
                backgroundColor="white"
                borderRadius={5}
              />
            </TouchableOpacity>

            {isCameraEnabled && <Webcam />}

            <WebView
              source={{
                uri: godot,
              }}
              // source={require("../assets/feagi/index.html")}
              // ❗ NOTE: The below values are in place to be ultra-permissive to pinpoint display/interaction issues. They should be altered/eliminated where unneeded
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
          </View>
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  cameraPreview: {
    position: "absolute",
    width: 120,
    height: 160,
    right: 10,
    top: 10,
    zIndex: 100,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "white",
  },
  flipButton: {
    position: "absolute",
    bottom: 5,
    right: 5,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    padding: 5,
  },
  button: {
    position: "absolute", // Position the button absolutely
    bottom: 20, // Distance from the bottom of the screen
    alignSelf: "center", // Center the button horizontally
    backgroundColor: "#007AFF", // Example background color
    padding: 10,
    borderRadius: 5,
  },

  menuButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },

  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#2e2e2e",
    paddingTop: 50,
    zIndex: 2,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },

  menuItemText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },

  menuScrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  modalContainer: {
    backgroundColor: "#1e1e1e",
    borderRadius: 20,
    width: "95%",
    height: "80%",
  },

  modalText: {
    color: "white",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  fixedModalContainer: {
    width: "85%",
    backgroundColor: "#0A1A3A",
    borderRadius: 20,
    padding: 20,
    height: "auto",
    minWidth: 250,
    minHeight: 250,
    maxWidth: 500,
    maxHeight: 400,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  closeButton: {
    padding: 5,
  },

  closeButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },

  divider: {
    height: 1,
    backgroundColor: "#555",
    marginBottom: 15,
    width: "100%",
  },

  settingsWrapper: {
    marginBottom: 20,
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },

  settingLabel: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },

  fixedButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  cancelButton: {
    backgroundColor: "#81D4FA",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },

  applyButton: {
    backgroundColor: "#81D4FA",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#0A1A3A",
    fontSize: 18,
    fontWeight: "bold",
  },
});
