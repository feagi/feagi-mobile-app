import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Camera, CameraType, CameraView } from "expo-camera";
import { Ionicons } from "@expo/vector-icons";
import { WebSocketManager } from "../app/websocket";
import { Inputs, UpdateInput } from "../types/inputs";

type CameraPermissionResponse = {
  status: "granted" | "denied" | "undetermined";
  granted: boolean;
};

type WebcamProps = {
  wsMgr: React.RefObject<WebSocketManager>;
  capabilities: Record<string, any>;
  inputs: Inputs;
  updateInput: UpdateInput;
};

const Webcam: React.FC<WebcamProps> = ({
  wsMgr,
  capabilities,
  inputs,
  updateInput,
}) => {
  // @ts-ignore
  const cameraRef = useRef<Camera | null>(null);
  const [isCameraMounted, setIsCameraMounted] = useState(false);
  const [frameIntervalId, setFrameIntervalId] = useState<NodeJS.Timeout | null>(
    null
  );
  const [facing, setFacing] = useState<CameraType>("front");
  const [permission, setPermission] = useState<CameraPermissionResponse | null>(
    null
  );
  // const [lastFrame, setLastFrame] = useState<string | null>(null);

  const changeCameraState = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setPermission({ status, granted: status === "granted" });

      // Only set camera enabled if permission was just granted
      if (status === "granted") {
        updateInput("camera", { enabled: true });
        console.log("status is set to granted");
        // capabilities.capabilities.input.camera[0].disabled = false;
        // capabilities.capabilities.input.camera[0].threshold_default = 50; // Example
        // capabilities.capabilities.input.camera[0].mirror = false;
        // wsMgr.current?.send(JSON.stringify(capabilities));
      }
    } catch (error) {
      console.error("Camera permission error:", error);
      // capabilities.capabilities.input.camera[0].disabled = true;
      // wsMgr.current?.send(JSON.stringify(capabilities));
      updateInput("camera", { slider: false });
    }
  };

  const startCameraFeed = async () => {
    try {
      // Start frame capture interval
      const frameInterval = setInterval(async () => {
        if (cameraRef.current) {
          try {
            // Capture frame
            const photo = await cameraRef.current?.takePictureAsync({
              quality: 0.7,
              base64: true,
              skipProcessing: true,
            });

            // Combine with other sensor data
            const combinedData = {
              timestamp: Date.now(),
              camera: {
                frame: photo.base64,
                width: photo.width,
                height: photo.height,
              },
            };
            // console.log(combinedData);
            // Send via WebSocket
            // wsMgr.current?.send(JSON.stringify(combinedData));
          } catch (error) {
            console.error("Frame capture error:", error);
          }
        }
      }, 300); // 10fps (adjust as needed)

      setFrameIntervalId(frameInterval);

      // Notify FEAGI camera is active
      wsMgr.current?.send(
        JSON.stringify({
          type: "camera_control",
          status: "activated",
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Camera feed start error:", error);
    }
  };

  const stopCameraFeed = () => {
    updateInput("camera", { enabled: false });
    setIsCameraMounted(false);
    console.log("stop");
    // wsMgr.current?.send(
    //   JSON.stringify({
    //     type: "camera_control",
    //     status: "deactivated",
    //     timestamp: Date.now(),
    //   })
    // );
  };

  useEffect(() => {
    if (inputs.camera.slider) {
      changeCameraState();
    } else {
      console.log("stopcamerafeed called");
      stopCameraFeed();
      capabilities.capabilities.input.camera[0].disabled = true;
    }

    // if (isCameraEnabled) {
    //   if (!permission?.granted) {
    //     requestPermission().then(({ granted }) => {
    //       if (granted) {
    //         startCameraFeed();
    //       }
    //     });
    //     //updateSensoryData();
    //   } else {
    //     console.log("Camera is activated");
    //     startCameraFeed();
    //   }
    // } else {
    //   stopCameraFeed();
    // }
  }, [inputs.camera.enabled]);

  const flipCamera = () => {
    setFacing((current) => (current === "back" ? "front" : "back"));
  };

  return (
    <>
      {permission?.granted && (
        <CameraView
          style={styles.cameraPreview}
          facing={facing}
          onCameraReady={() => {
            console.log("Camera is ready");
            setIsCameraMounted(true);
            startCameraFeed();
          }}
          ref={cameraRef}
        >
          <TouchableOpacity style={styles.flipButton} onPress={flipCamera}>
            <Ionicons name="camera-reverse" size={24} color="white" />
          </TouchableOpacity>
        </CameraView>
      )}
    </>
  );
};

export default Webcam;

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
});
