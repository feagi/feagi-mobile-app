import { Text, View , StyleSheet, TextInput, Button, Alert, Pressable } from "react-native";
import { Link } from 'expo-router';
//import * as React from 'react';
import React, {useEffect, useState} from "react"
import {AsyncStorage} from 'react-native';




export default function Index() {

  const [text, onChangeText] = useState('');
  const [number, onChangeNumber] = useState('');
  const [API, onAPIChange] = useState('');
  const [magicLink, onMagicLinkChange] = useState('');
  const [apiText, onApiTextChange] = useState('');



  //https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M


//https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-scarbctkdkexhcscwmjl-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-scarbctkdkexhcscwmjl-feagi.feagi-k8s-production.neurorobotics.studio/p9050&http_type=HTTPS://

//we are really cooking here!!!!!
//this is the code for the background FEAGI API call its in the old app docs and its really cool


  return (
    <View
      style={
		  styles.container

      }
    >
      <Text style={styles.text}>Edit app/index.tsx to edit this screen.</Text>
      <Text style={styles.text}>{number}</Text>
      <TextInput style={styles.text}
	      placeholderTextColor='gray'
	      onChangeText={onChangeText}
	      value={text}
	      placeholder="useless placeholder"
      />

      <Button
        //onPress = {() => Alert.alert(text)}
        onPress = {() =>
            Alert.alert("click the Link to start the browser")}
        title="click me!"
        color="#841584"
        accessibilityLabel="Learn more about this purple button"
      />

       <Text style={styles.text}>{magicLink}</Text>
       <Text style={styles.text}>{apiText}</Text>

       <Link replace href="/input" asChild>
            <Pressable>
                <Text style={[styles.text, {margin: 30, fontSize: 20}]}>Click To Start Project Demo</Text>
            </Pressable>
       </Link>
    </View>
  );
}




const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#353839',
  },
  text: {
	  color: 'white',
  }
});


