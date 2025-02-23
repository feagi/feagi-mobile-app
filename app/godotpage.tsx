import { View, ScrollView } from "react-native";
import WebView from "react-native-webview";




export default function GodotPage() {

  return (
    <WebView


            originWhitelist={['*']}

              source={{
                uri: "https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-tcdxbrjxezbxvslzratc-feagi.feagi-k8s-production.neurorobotics.studio/p9055&http_type=HTTPS://",
              }}

		      style={{flex: 1, backgroundColor: 'red', pointerEvents: 'box-none'}}



              javaScriptEnabled={true}
              domStorageEnabled={true}
              allowFileAccess={true}
              allowUniversalAccessFromFileURLs={true}
              mixedContentMode="always"
              scrollEnabled={false}
              allowFileAccessFromFileURLs={true}
              mediaPlaybackRequiresUserAction={false}
              scalesPageToFit={true}
              bounces={false}
              domStorageEnabled={true}
              androidLayerType="hardware"


              //https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio/p9055&http_type=HTTPS://
            />
  );
}


/*import { Pressable, Text, View, StyleSheet, TouchableOpacity, ThemedText, ScrollView, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import WebView from "react-native-webview";
import React, {useEffect, useState} from "react"


export default function GodotPage() {
//        					  uri: 'https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio/p9050&http_type=HTTPS://'

	return(
		<View style={{height: 600}}>
		<WebView
        	              source={{
								uri: "https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=https://user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio/p9050&http_type=HTTPS://",
        					  }}

        					//https://user-hlkgytoqpysajsmxvgvq-feagi.feagi-k8s-production.neurorobotics.studio
        				  //https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=${feagi_url}&port_disabled=true&websocket_url=wss://${feagi_url with https:// changed to wss://}/p9050&http_type=HTTPS://
        	                 //https://user-upxdlwiwqopnljbtpbiq-feagi.feagi-k8s-production.neurorobotics.studio
        	              // ❗ NOTE: The below values are in place to be ultra-permissive to pinpoint display/interaction issues. They should be altered/eliminated where unneeded
        	              //source={require("../assets/feagi/index.html")}
        	              style={{ flex: 1 }}
        	              javaScriptEnabled={true}
        	              domStorageEnabled={true}
        	              allowFileAccess={true}
        	              allowUniversalAccessFromFileURLs={true}
        	              allowFileAccessFromFileURLs={true}
        	              mediaPlaybackRequiresUserAction={false}
        	              scalesPageToFit={true}
        	              bounces={false}
        	              javaScriptEnabled={true}
                          domStorageEnabled={true}
                          startInLoadingState={true}
        	                />
                </View>

	    );


}
*/
