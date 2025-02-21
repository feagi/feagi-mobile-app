import { Pressable, Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from "react"


export default function Signin() {

  const [text, onChangeText] = useState(0);
  const [API, onAPIChange] = useState('');
  const [magicLink, onMagicLinkChange] = useState('');
  const [apiText, onApiTextChange] = useState(0);
  //ok so make it so they can access the plug in thing

  //This is where the API methods go!

  const apiCall = async (api) => {
    //fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M')
    try {
      const response = await fetch(api)
      const json = await response.json()

      console.log("hello " + json.feagi_url);
      onMagicLinkChange(json.feagi_url);
      return (json);
    }
    catch (error) {
      console.error(error);
      router.replace('/plugin');
    }
  };

  const regApiCall = async (api) => {
    try {
      //fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M')
      const response = await fetch(api)
      const json = await response.json()

      console.log(json);
      //onMagicLinkChange(json.feagi_url);
      onApiTextChange(json);
      return (json);
    }

    catch (error) {
      console.error(error);
      // router.replace('/plugin');
    }
  };



  useEffect(() => {

    const superFunction = async () => {
      var addNum = regApiCall(magicLink + "/v1/burst_engine/burst_counter")
      console.log(addNum);
      onApiTextChange(addNum);
      console.log("api should be changing and showing here")
    }
    superFunction();
  }, [magicLink]);


  //add instructions or connecting messaged or something
  return (

    <View style={styles.container}>

      <Text style={[styles.text, { fontSize: 30, marginBottom: 65 }]}>
        Network Configuration
      </Text>

      <TextInput style={[styles.text, styles.input, { marginBottom: 15 }]}
        placeholderTextColor='gray'
        // onChangeText={onChangeText}
        // value={text}
        placeholder="Paste Magic Link or IP Address"
      />


      <TouchableOpacity
        style={{ height: 60, width: 200, backgroundColor: '#484a6e', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#2e3133', marginBottom: 50 }}
        onPress={() => apiCall(text)}>

        <Text style={styles.text}>Connect</Text>

      </TouchableOpacity>

      <TouchableOpacity
        style={{ height: 60, width: 200, backgroundColor: '#484a6e', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#2e3133', marginBottom: 50 }}
        onPress={() => router.replace('/brainMonitor')}>

        <Text style={styles.text}>Go to BM placeholder</Text>

      </TouchableOpacity>

      <Text style={styles.info}>{"MagicLink: " + magicLink}</Text>
      <Text style={styles.info}>{"API Connection Number: " + apiText}</Text>



    </View>
  );



}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: '#0D0D0D',
  },
  text: {
    color: 'white',
    fontSize: 20,
    fontFamily:"SpaceMono-Regular",
  },
  info: {
    color: 'white',
    fontSize: 20,
    justifyContent: "flex",
    alignSelf: 'flex-start',
    alignItems: "left",
    margin: 10,
    fontFamily:"SpaceMono-Regular",
  },
  input: {
    backgroundColor: "#2B547E",
    borderWidth: 2,
    borderRadius: 3,
    height: 60,
    width: 200,
    fontSize: 15
  }
  },
);


export default Signin