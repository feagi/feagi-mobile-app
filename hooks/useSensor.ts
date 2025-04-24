import { useEffect } from "react";
import {
  Accelerometer,
  AccelerometerMeasurement,
  Gyroscope,
  GyroscopeMeasurement,
} from "expo-sensors";
// @ts-ignore
import { compress } from "lz4js";
import { WebSocketManager } from "../app/websocket";
import { getASCII } from "../utils/littleHelpers";

interface UseSensorProps {
  sensorType: "acc" | "gyro";
  inputs: {
    accel: { slider: boolean; enabled: boolean };
    gyro: { slider: boolean; enabled: boolean };
    camera: { slider: boolean; enabled: boolean };
  };
  wsMgr: React.RefObject<WebSocketManager | null>;
  capabilities: any;
}

const useSensor = ({
  sensorType,
  inputs,
  wsMgr,
  capabilities,
}: UseSensorProps) => {
  const sensorEnabled =
    sensorType === "acc" ? inputs.accel.enabled : inputs.gyro.enabled;
  const Sensor = sensorType === "acc" ? Accelerometer : Gyroscope;
  const sensorName = sensorType === "acc" ? "accelerometer" : "gyro";
  const ASCII = sensorType === "acc" ? getASCII("rawACC") : getASCII("rawGYR");

  const formatAccGyroData = (
    data: AccelerometerMeasurement | GyroscopeMeasurement
  ) => {
    const formatted = [
      ...ASCII,
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
    if (sensorEnabled) {
      async function enableSensor() {
        if (!Sensor.hasListeners()) {
          Sensor.setUpdateInterval(1000);
          capabilities.capabilities.input[sensorName][0].disabled = false;

          Sensor.addListener((data) => {
            console.log(data);
            if (!wsMgr.current) {
              console.error(
                `No websocket found. Skipping sending ${sensorName} data.`
              );
              return;
            }
            if (!data?.x) {
              console.error(
                `Got ${sensorName} data, but it doesn't have an x value:`,
                data
              );
              return;
            }
            const compressed = formatAccGyroData(data);
            wsMgr.current?.send(compressed);
          });
        }
      }

      enableSensor();

      return () => {
        Sensor.removeAllListeners();
        capabilities.capabilities.input[sensorName][0].disabled = true;
      };
    } else {
      Sensor.removeAllListeners();
      capabilities.capabilities.input[sensorName][0].disabled = true;
    }
  }, [sensorEnabled, sensorType, wsMgr, capabilities]);
};

export default useSensor;

// let minAccel = { x: Infinity, y: Infinity, z: Infinity };
// let maxAccel = { x: -Infinity, y: -Infinity, z: -Infinity };
// let minGyro = { x: Infinity, y: Infinity, z: Infinity };
// let maxGyro = { x: -Infinity, y: -Infinity, z: -Infinity };

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

// const formatAccGyroData = (
//   data: AccelerometerMeasurement | GyroscopeMeasurement,
//   type: string
// ) => {
//   const formatted = [
//     ...(type === "acc" ? accelerometerASCII : gyroASCII),
//     12, // width/length
//     0, // height (N/A here)
//     0,
//     0,
//     0,
//     data.x,
//     1,
//     0,
//     0,
//     data.y,
//     2,
//     0,
//     0,
//     data.z,
//   ];

//   const compressed = compress(
//     new TextEncoder().encode(JSON.stringify(formatted))
//   );

//   return compressed;
// };

// useEffect(() => {
//   async function letsGetItStarted() {
//     if (
//       inputs.accel.enabled ||
//       inputs.gyro.enabled ||
//       inputs.camera.enabled
//     ) {
//       console.log("initializing ws");
//       if (!wsMgr.current) wsMgr.current = new WebSocketManager(capabilities);
//       await wsMgr.current.initialize();
//     }
//   }

//   letsGetItStarted();

//   if (inputs.accel.enabled && !Accelerometer.hasListeners()) {
//     Accelerometer.setUpdateInterval(1000);
//     capabilities.capabilities.input.accelerometer[0].disabled = false;

//     Accelerometer.addListener((data) => {
//       // console.log("ACCELEROMETER DATA:", data);
//       if (!wsMgr.current) {
//         console.error(
//           "No websocket found. Skipping sending accelerometer data."
//         );
//         return;
//       }
//       if (!data?.x) {
//         console.error(
//           "Got accelerometer data, but it doesn't have an x value:",
//           data
//         );
//         return;
//       }

//       const compressed = formatAccGyroData(data, "acc");
//       wsMgr.current?.send(compressed);
//     });

//     // return () => sub.remove(); // Proper cleanup
//   } else if (!inputs.accel.enabled && Accelerometer.hasListeners()) {
//     Accelerometer.removeAllListeners();
//     capabilities.capabilities.input.accelerometer[0].disabled = true;
//   }
//   // else if (!isAccelerometerEnabled && !hasAccelerometerPermission) {
//   // handleAccelPermission();
//   // }

//   if (inputs.gyro.enabled && !Gyroscope.hasListeners()) {
//     Gyroscope.setUpdateInterval(1000);
//     capabilities.capabilities.input.gyro[0].disabled = false;

//     Gyroscope.addListener((data) => {
//       // console.log("GYROSCOPE DATA:", data);
//       if (!wsMgr.current) {
//         console.error("No websocket found. Skipping sending gyro data.");
//         return;
//       }
//       if (!data?.x) {
//         console.error("Got gyro data, but it doesn't have an x value:", data);
//         return;
//       }
//       const compressed = formatAccGyroData(data, "gyro");
//       wsMgr.current?.send(compressed);
//     });
//   } else if (!inputs.gyro.enabled && Gyroscope.hasListeners()) {
//     Gyroscope.removeAllListeners();
//     capabilities.capabilities.input.gyro[0].disabled = true;
//   }
// }, [inputs.accel.enabled, inputs.gyro.enabled, inputs.camera.enabled]);
