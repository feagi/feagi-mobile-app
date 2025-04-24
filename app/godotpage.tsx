import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import WebView from "react-native-webview";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import capabilities from "../constants/capabilities.js";
import { WebSocketManager } from "./websocket";
import MobileSettings from "../components/MobileSettings";
import HamburgerMenu from "../components/HamburgerMenu";
import Webcam from "../components/Webcam";
import useSensor from "../hooks/useSensor";

export default function GodotPage() {
  const [godot, onGodotChange] = useState("");
  const [deviceOrientation, setDeviceOrientation] = useState("portrait");
  const [menuVisible, setMenuVisible] = useState(false); // hamburger menu
  const slideAnim = useRef(new Animated.Value(-250)).current; // animation for sliding menu
  const [mobileSettingsModalVisible, setMobileSettingsModalVisible] =
    useState(false);
  const wsMgr = useRef<WebSocketManager | null>(null);
  const [inputs, setInputs] = useState({
    camera: { slider: false, enabled: false },
    gyro: { slider: false, enabled: false },
    accel: { slider: false, enabled: false },
  });

  // Get FEAGI URL
  useEffect(() => {
    const plugGodot = async () => {
      const value = await AsyncStorage.getItem("user");
      const concatLink = value?.slice(8);
      const wssLink = value?.replace("https", "wss");
      const godotLink = `https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=${concatLink}&port_disabled=true&websocket_url=${wssLink}/p9055&http_type=HTTPS://`;
      console.log("godotLink: " + godotLink);
      onGodotChange(godotLink);
    };

    plugGodot();
  }, []);

  // Landscape / portrait
  useEffect(() => {
    const { width, height } = Dimensions.get("window");
    const initialOrientation = width > height ? "landscape" : "portrait";
    setDeviceOrientation(initialOrientation);

    const handleOrientationChange = ({
      window,
    }: {
      window: { width: number; height: number };
    }) => {
      const { width, height } = window;
      setDeviceOrientation(width > height ? "landscape" : "portrait");
    };

    const subscription = Dimensions.addEventListener(
      "change",
      handleOrientationChange
    );

    return () => {
      subscription.remove();
    };
  }, []);

  // Hamburger display
  const toggleMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setMenuVisible(!menuVisible);
  };

  // Open websocket when an input is enabled
  useEffect(() => {
    async function letsGetItStarted() {
      if (
        inputs.accel.enabled ||
        inputs.gyro.enabled ||
        inputs.camera.enabled
      ) {
        console.log("initializing ws");
        if (!wsMgr.current) wsMgr.current = new WebSocketManager(capabilities);
        await wsMgr.current.initialize();
      }
    }

    letsGetItStarted();
  }, [inputs.accel.enabled, inputs.gyro.enabled, inputs.camera.enabled]);

  // Hook to connect and send/receive gyro/acc data
  useSensor({
    sensorType: "acc",
    inputs: inputs,
    wsMgr: wsMgr,
    capabilities: capabilities,
  });

  useSensor({
    sensorType: "gyro",
    inputs: inputs,
    wsMgr: wsMgr,
    capabilities: capabilities,
  });

  // Helpers to update input states
  function updateInput(
    name: "camera" | "gyro" | "accel",
    changes: Partial<{ slider: boolean; enabled: boolean }>
  ) {
    setInputs((prev) => ({
      ...prev,
      [name]: { ...prev[name], ...changes },
    }));
  }

  const updateSensoryData = () => {
    setInputs((prev) => ({
      camera: { ...prev.camera, enabled: prev.camera.slider },
      gyro: { ...prev.gyro, enabled: prev.gyro.slider },
      accel: { ...prev.accel, enabled: prev.accel.slider },
    }));
  };

  const cancelSensoryData = () => {
    setInputs((prev) => ({
      camera: { ...prev.camera, slider: prev.camera.enabled },
      gyro: { ...prev.gyro, slider: prev.gyro.enabled },
      accel: { ...prev.accel, slider: prev.accel.enabled },
    }));
    setMobileSettingsModalVisible(false);
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
          inputs={inputs}
          updateInput={updateInput}
          cancelSensoryData={cancelSensoryData}
          updateSensoryData={updateSensoryData}
          mobileSettingsModalVisible={mobileSettingsModalVisible}
          setMobileSettingsModalVisible={setMobileSettingsModalVisible}
        />

        <ScrollView style={{ flex: 1 }}>
          <View style={{ height: 600 }}>
            {/* Hamburger Menu Button */}
            <TouchableOpacity
              style={{
                position: "absolute",
                top: 20,
                left: 20,
                zIndex: 1,
              }}
              onPress={toggleMenu}
            >
              <Ionicons
                name="menu"
                size={64}
                color="black"
                backgroundColor="white"
                borderRadius={5}
              />
            </TouchableOpacity>

            {inputs.camera.enabled && (
              <Webcam
                wsMgr={wsMgr}
                capabilities={capabilities}
                inputs={inputs}
                updateInput={updateInput}
              />
            )}

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
