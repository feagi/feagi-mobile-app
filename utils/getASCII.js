export const getASCII = (str) => {
  return Array.from(str).map((char) => char.charCodeAt(0));
};

export const getASCIIValues = {
  canvas: getASCII("canvas"),
  cortex: getASCII("CORTEX"),
  iId: getASCII("i___id"),
  iMisc: getASCII("i_misc"),
  imu: getASCII("imu___"),
};
