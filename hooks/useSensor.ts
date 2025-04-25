import { useEffect, useRef } from "react";
import { Accelerometer, Gyroscope } from "expo-sensors";
import { compress } from "lz4js";
import constructIMUToFEAGI from "@/utils/constructIMUToFEAGI";
import { WebSocketManager } from "../app/websocket";

interface UseCombinedSensorsProps {
  inputs: {
    accel: { slider: boolean; enabled: boolean };
    gyro: { slider: boolean; enabled: boolean };
    camera: { slider: boolean; enabled: boolean };
  };
  wsMgr: React.RefObject<WebSocketManager | null>;
  capabilities: any;
}

const useCombinedSensors = ({
  inputs,
  wsMgr,
  capabilities,
}: UseCombinedSensorsProps) => {
  const latestAcc = useRef<number[] | null>(null);
  const latestGyr = useRef<number[] | null>(null);

  useEffect(() => {
    let accListener: any, gyrListener: any;

    // Enable/disable in capabilities as appropriate
    if (inputs.accel.enabled) {
      capabilities.capabilities.input["accelerometer"][0].disabled = false;
      Accelerometer.setUpdateInterval(50);
      accListener = Accelerometer.addListener((data) => {
        latestAcc.current = [data.x, data.y, data.z];
      });
    } else {
      capabilities.capabilities.input["accelerometer"][0].disabled = true;
    }

    if (inputs.gyro.enabled) {
      capabilities.capabilities.input["gyro"][0].disabled = false;
      Gyroscope.setUpdateInterval(50);
      gyrListener = Gyroscope.addListener((data) => {
        latestGyr.current = [data.x, data.y, data.z];
      });
    } else {
      capabilities.capabilities.input["gyro"][0].disabled = true;
    }

    // Send both sensors together at a regular interval
    const interval = setInterval(() => {
      if (!wsMgr.current) return;
      if (!inputs.accel.enabled && !inputs.gyro.enabled) return;

      const buffer = constructIMUToFEAGI({
        acc: inputs.accel.enabled ? latestAcc.current ?? undefined : undefined,
        gyr: inputs.gyro.enabled ? latestGyr.current ?? undefined : undefined,
      });

      if (buffer) {
        console.log(buffer);
        wsMgr.current.send(compress(buffer));
      }
    }, 50);

    // Cleanup
    return () => {
      accListener && accListener.remove();
      gyrListener && gyrListener.remove();
      clearInterval(interval);
      // On cleanup, mark both as disabled
      capabilities.capabilities.input["accelerometer"][0].disabled = true;
      capabilities.capabilities.input["gyro"][0].disabled = true;
    };
  }, [inputs.accel.enabled, inputs.gyro.enabled, wsMgr]);
};

export default useCombinedSensors;
