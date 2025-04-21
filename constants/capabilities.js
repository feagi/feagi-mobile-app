// apply JSON.stringify() to this before sending
export default capabilities = {
  capabilities: {
    input: {
      gyro: {
        0: {
          custom_name: "gyro",
          disabled: false,
          min_value: [-1.0, -1.0, -1.0],
          max_value: [1.0, 1.0, 1.0],
          feagi_index: 0,
        },
      },
      accelerometer: {
        0: {
          custom_name: "acceleration",
          disabled: false,
          min_value: [-1.0, -1.0, -1.0],
          max_value: [1.0, 1.0, 1.0],
          feagi_index: 0,
        },
      },
      camera: {
        0: {
          custom_name: "camera",
          disabled: false,
          index: "00",
          mirror: false,
          eccentricity_control: {
            "X offset percentage": 1,
            "Y offset percentage": 1,
          },
          modulation_control: {
            "X offset percentage": 99,
            "Y offset percentage": 99,
          },
          threshold_default: 50,
          feagi_index: 0,
        },
      },
    },
    output: {},
  },
};
