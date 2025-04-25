import toBytes from "./toBytes";
import { getASCIIValues } from "./getASCII";

// example:
// [
//     ...ascii of "imu___", // Uint8
//     0, 1, 0, // Uint8
//     0, 0, 0, // Uint8
//     1.3, 0.5, -1.1, // float32
//     0, 0, 0 // Uint8
// ]

const ascii = getASCIIValues.imu;

const constructIMUToFEAGI = ({
  gyr,
  acc,
  eul,
}: {
  gyr?: number[];
  acc?: number[];
  eul?: number[];
}) => {
  try {
    const chunks = [];

    // ascii
    chunks.push(toBytes.uint8(ascii));

    // key (tells which sensor values we're sending)
    chunks.push(toBytes.uint8([gyr ? 1 : 0, acc ? 1 : 0, eul ? 1 : 0]));

    // values
    const addVal = (sensorData: number[] | undefined) => {
      chunks.push(toBytes.float32(sensorData ? sensorData : [0, 0, 0]));
    };

    addVal(gyr);
    addVal(acc);
    addVal(eul);

    // flatten chunks into a single Uint8Array
    const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const finalBuffer = new Uint8Array(totalLength);

    let offset = 0;
    for (const chunk of chunks) {
      finalBuffer.set(chunk, offset);
      offset += chunk.length;
    }

    return finalBuffer;
  } catch (err) {
    console.error("Error constructing byte data:", err);
    return null;
  }
};

export default constructIMUToFEAGI;
