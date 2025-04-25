// Helper function to convert values to bytes
const toBytes = {
  uint8: (values: any) => new Uint8Array(values),
  uint16: (values: any) => new Uint8Array(new Uint16Array(values).buffer),
  uint32: (values: any) => new Uint8Array(new Uint32Array(values).buffer),
  float32: (values: any) => new Uint8Array(new Float32Array(values).buffer),
};

export default toBytes;
