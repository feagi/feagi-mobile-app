import { Pressable, Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from "react"


export default function Signin() {

  const [text, onChangeText] = useState('');
  const [API, onAPIChange] = useState('');
  const [magicLink, onMagicLinkChange] = useState('');
  const [apiText, onApiTextChange] = useState('');
  //ok so make it so they can access the plug in thing

  //This is where the API methods go!

	const apiCall = async (api: string) =>{
          //fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJBZk9RN1BEOFdvZjNDTUtkeEg4Y1RRU2lmSWgyIn0.ipgP6Ifby86zsRDKK6hhW9ZwfVYHP266uaZstwdN25M')
          try{
	          const response = await fetch('https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=' + api)
	          const json = await response.json()
			console.log("json is: " + json.toString());
	          console.log("hello " + json.feagi_url);
	          onMagicLinkChange(json.feagi_url);
	          return(json);
          }
    	  catch(error) {
			  console.error(error);
            }
		};

  const regApiCall = async (api: string) => {
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
    }
  };



  useEffect(() => {

    const superFunction = async () => {
      try {
        const addNum = await regApiCall(magicLink + "/v1/burst_engine/burst_counter");
        console.log(addNum);
        onApiTextChange(addNum);
        console.log("api should be changing and showing here");
      } catch (error) {
        console.error(error);
      }
    };
    superFunction();
  }, [magicLink]);


  //add instructions or connecting messaged or something
  return (

    <View style={styles.container}>

      <Text style={[styles.text, { fontSize: 30, marginBottom: 65 }]}>
        Log In
      </Text>

	<TextInput style={[styles.text, {marginBottom: 15}]}
          placeholderTextColor='gray'
          onChangeText={onChangeText}
          value={text}
          placeholder="Enter API Key"
    />


      <TouchableOpacity
        style={{ height: 60, width: 200, backgroundColor: '#484a6e', justifyContent: 'center', alignItems: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#2e3133', marginBottom: 50 }}
        onPress={() => apiCall(text)}>

        <Text style={styles.text}>Confirm Link</Text>

      </TouchableOpacity>

      <Text style={styles.info}>{"MagicLink: " + magicLink}</Text>
      <Text style={styles.info}>{"API Connection Number: " + apiText}</Text>


	<TouchableOpacity
    	    style={{ height: 60, width: 200, backgroundColor:'#484a6e', justifyContent: 'center', alignItems: 'center',borderRadius: 10, borderWidth: 3, borderColor:'#2e3133', marginBottom: 50}}
    	    onPress = {() => router.replace('/godotpage')}>

            <Text style={styles.text}>next</Text>

    </TouchableOpacity>

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
    fontSize: 20
  },
  info: {
    color: 'white',
    fontSize: 20,
    justifyContent: "flex-start",
    alignSelf: 'flex-start',
    alignItems: "flex-end",
    margin: 10,
  }
});
