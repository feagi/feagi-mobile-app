import AsyncStorage from "@react-native-async-storage/async-storage";
import { compress, decompress } from "lz4js";
let webSocket: WebSocket;
let magicLink;

const statusCodes: Record<number, string> = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED",
};

export const initializeSocket = async (capabilities) => {
  try {
    magicLink = await AsyncStorage.getItem("user");
    if (!magicLink) {
      console.error("could not get magic link from AsyncStorage");
      return;
    }

    const url = magicLink.replace("https", "wss");

    webSocket = new WebSocket(`${url}/p9051`);

    console.log("websocket initialized with url:", `${url}/p9051`);

    webSocket.onopen = () => {
      console.log("connection opened");
      if (webSocket.readyState === WebSocket.OPEN) {
        console.log("sending capabilities");
        const json = JSON.stringify(capabilities);
        const buffer = new TextEncoder().encode(json);
        webSocket.send(compress(buffer));
      }
    };

    webSocket.onmessage = (e) => {
      // console.log("message from server: ", e.data);
    };

    webSocket.onerror = (e) => {
      console.log("error: ", e);
    };

    webSocket.onclose = () => {
      console.log("websocket closed");
    };

    return () => {
      webSocket.close();
    };
  } catch {
    console.log("could not get magic link");
  }
};

export const sendData = (data: string) => {
  if (!webSocket) {
    console.error("websocket is not initialized");
    return;
  }

  if (webSocket.readyState !== WebSocket.OPEN) {
    console.error(
      "cannot send data as websocket is not open. readyState: ",
      statusCodes[webSocket.readyState]
    );
    return;
  }

  console.log("sending data: ", data);
  webSocket.send(data);
};
