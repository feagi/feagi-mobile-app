import AsyncStorage from '@react-native-async-storage/async-storage';

let webSocket: WebSocket;
let magicLink;


export const initializeSocket = async () => {
    // try {
    //     magicLink = await AsyncStorage.getItem('user');
    //     if(!magicLink) {
    //         console.log("could not get magic link");
    //         return;
    //     }
    //     const url = magicLink.replace('https', 'ws');
    
    //     webSocket = new WebSocket(url);
        
    //     webSocket.onopen = () => {
    //         console.log("connection opened");
        
    //     };
        
    //     webSocket.onmessage = (e) => {
    //         console.log('message from server: ', e.data);
        
    //     };
        
    //     webSocket.onerror = (e) => {
    //         console.log('error: ', e);
    //     };
        
    //     webSocket.onclose = () => {
    //         console.log('websocket closed');
    //     };
        
    //     return () => {
    //         webSocket.close();
    //     }
    // } catch {
    //     console.log("could not get magic link");
    // }

};

export const sendData = (data: string) => {
    // if (webSocket && webSocket.OPEN) {
    //     webSocket.send(data);
    // }
    // else {
    //     console.log('cannot send data as url was not given');
    // }
}


    
    
    

