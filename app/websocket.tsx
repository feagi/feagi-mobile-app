let webSocket: WebSocket;

export default function initializeSocket() {
  // webSocket = new WebSocket('ws://');
  // webSocket.onopen = () => {
  //     console.log("connection opened");
  // };
  // webSocket.onmessage = (e) => {
  //     console.log('message from server: ', e.data);
  // };
  // webSocket.onerror = (e) => {
  //     console.log('error: ', e);
  // };
  // webSocket.onclose = () => {
  //     console.log('websocket closed');
  // };
  // return () => {
  //     webSocket.close();
  // }
}

export const sendData = (data: string) => {
  // if (webSocket && webSocket.OPEN) {
  //     webSocket.send(data);
  // }
};
