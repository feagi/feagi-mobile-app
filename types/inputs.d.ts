export type Inputs = {
  camera: { slider: boolean; enabled: boolean };
  gyro: { slider: boolean; enabled: boolean };
  accel: { slider: boolean; enabled: boolean };
};

export type UpdateInput = (
  name: "camera" | "gyro" | "accel",
  changes: Partial<{ slider: boolean; enabled: boolean }>
) => void;
