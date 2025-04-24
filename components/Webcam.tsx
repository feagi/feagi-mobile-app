import { Ionicons } from "@expo/vector-icons";
import { Camera, CameraType, CameraView } from "expo-camera";
import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

type CameraPermissionResponse = {
  status: "granted" | "denied" | "undetermined";
  granted: boolean;
};

const Webcam = ({
  wsMgr,
  capabilities,
  isCameraEnabled,
  setIsCameraEnabled,
}) => {
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
      //   console.log("Camera permission status:", status);
      setPermission({ status, granted: status === "granted" });

      // Only set camera enabled if permission was just granted
      if (status === "granted") {
        setIsCameraEnabled(true); // Directly set to true
        console.log("status is set to granted");
        capabilities.capabilities.input.camera[0].disabled = false;

        // Optional: Update camera parameters if needed
        capabilities.capabilities.input.camera[0].threshold_default = 50; // Example
        capabilities.capabilities.input.camera[0].mirror = false;

        wsMgr.current?.send(JSON.stringify(capabilities));
      }
    } catch (error) {
      console.error("Camera permission error:", error);
      capabilities.capabilities.input.camera[0].disabled = true;
      // wsMgr.current?.send(JSON.stringify(capabilities));
      setTempCameraEnable(false);
    }
  };

  // Ed added this
  const startCameraFeed = async () => {
    try {
      console.log("started camera feed");
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

            // console.log("Raw Camera Frame:", {
            //   base64Length: photo.base64?.length,
            //   width: photo.width,
            //   height: photo.height,
            //   uri: photo.uri,
            //   base64Prefix: photo.base64?.substring(0, 30) + "...", // Show first 30 chars of base64
            // });

            // Combine with other sensor data
            const combinedData = {
              timestamp: Date.now(),
              camera: {
                frame: photo.base64,
                width: photo.width,
                height: photo.height,
              },
              // sensors: {
              // 	accelerometer: minAccel, // Your existing min/max values
              // 	gyroscope: minGyro
              // }
            };

            // Send via WebSocket
            wsMgr.current?.send(JSON.stringify(combinedData));
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
    setIsCameraEnabled(false);
    setIsCameraMounted(false);
    wsMgr.current?.send(
      JSON.stringify({
        type: "camera_control",
        status: "deactivated",
        timestamp: Date.now(),
      })
    );
  };

  useEffect(() => {
    if (tempCameraEnable) {
      changeCameraState();
    } else {
      stopCameraFeed();
      capabilities.capabilities.input.camera[0].disabled = true;

      console.log("stopcamerafeed called");
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
  }, [isCameraEnabled]);

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
