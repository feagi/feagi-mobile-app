import AsyncStorage from "@react-native-async-storage/async-storage";
import { compress } from "lz4js";

const statusCodes: Record<number, string> = {
  0: "CONNECTING",
  1: "OPEN",
  2: "CLOSING",
  3: "CLOSED",
};

export class WebSocketManager {
  private webSocket: WebSocket | null = null;
  private magicLink: string | null = null;
  constructor(private capabilities: any) {}

  async initialize() {
    try {
      this.magicLink = await AsyncStorage.getItem("userSession");

      if (!this.magicLink) {
        console.error("could not get magic link from AsyncStorage");
        return;
      }

      const url = this.magicLink.replace("https", "wss");
      this.webSocket = new WebSocket(`${url}/p9051`);

      console.log("websocket initialized with url:", `${url}/p9051`);

      this.webSocket.onopen = () => {
        console.log("connection opened");

        if (this.webSocket?.readyState === WebSocket.OPEN) {
          console.log("sending capabilities");
          const json = JSON.stringify(this.capabilities);
          const buffer = new TextEncoder().encode(json);
          this.webSocket.send(compress(buffer));
        }
      };

      this.webSocket.onmessage = (e) => {
        // Handle incoming messages here
        // console.log("message from server: ", e.data);
      };

      this.webSocket.onerror = (e: any) => {
        console.log("ws error: ", e);
        if (e.message?.includes("404")) {
          alert(
            "Websocket connection gave a 404. Likely your FEAGI session is expired."
          );
        } else {
          alert("Websocket error: " + e.message);
        }
      };

      this.webSocket.onclose = () => {
        console.log("websocket closed");
      };
    } catch {
      console.log("could not get magic link");
    }
  }

  send(data: any) {
    if (!this.webSocket) {
      console.error("websocket is not initialized");
      return;
    }

    if (this.webSocket.readyState !== WebSocket.OPEN) {
      console.error(
        "cannot send data as websocket is not open. readyState: ",
        statusCodes[this.webSocket.readyState]
      );
      return;
    }

    // console.log("sending data: ", data);
    this.webSocket.send(data);
  }

  close() {
    if (this.webSocket) {
      this.webSocket.close();
    }
  }
}
