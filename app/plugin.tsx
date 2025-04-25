import { Pressable, Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import React, {useEffect, useState} from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Plugin() {
	const [text, onChangeText] = useState(0);

	//ok so make it so they can access the plug in thing
	const _retrieveData = async () => {
                   try {
                     //const value = await AsyncStorage.getItem('KEY1');
                     AsyncStorage.getAllKeys((err, keys) => {
						 console.log(keys);
						 if(keys === undefined || keys.length == 0){
							 console.log("no keys")
							 }
						 else{
							 console.log("yes keys")
							 }
                       AsyncStorage.multiGet(keys, (err, stores) => {
                         stores.map((result, i, store) => {
                           // get at each store's key/value so you can work with it
                           let key = store[i][0];
                           let value = store[i][1];
                           console.log("key: " + key + " Value: " + value);
                           AsyncStorage.removeItem(key);
                         });
                       });
                     });
                   } catch (error) {
    				   console.log(error);
                     // Error retrieving data
                   }
			   return value
                 };

	 useEffect(() => {

	    //console.log(await _retrieveData());
        _retrieveData();

    		}, []);


    return (

    <View

    style={styles.container}
    >
	<Image style={{width: 200, height: 200, margin: 50}} source={require('../assets/images/placeholderplugin.png')} />

    <TouchableOpacity
	    style={{ height: 60, width: 200, backgroundColor:'#484a6e', justifyContent: 'center', alignItems: 'center',borderRadius: 10, borderWidth: 3, borderColor:'#2e3133'}}
	    onPress = {() => router.replace('/signin')}>

        <Text style={styles.text}>Click To Connect</Text>
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
  }
});
