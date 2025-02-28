import { Pressable, Text, View, Button, StyleSheet, Image, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import React, {useEffect, useState} from "react"
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Input() {




	const _storeData = async () => {
		/*AsyncStorage.setItem(
          'Key3',
          'COOL');
			console.log("hrere ok"!)*/

            AsyncStorage.getItem('Key2', (err, result) => {
              console.log(result);
            });



	}

    useEffect(() => {
		console.log(_storeData());
        const timer = setTimeout(() => {

            router.replace('/plugin');

            }, 3000);
		console.log("done");

		return () => clearTimeout(timer);

    }, [])


	//THIS CODE WILL SEARCH THE SAVE API THING


    return (
    <View

    style={styles.container}
    >
	<Text style={[styles.text, { marginVertical: 20}]}>FEAGI Monitor</Text>
	<Image style={{width: 200, height: 200}} source={require('../assets/images/placeholder.png')} />


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
	  fontSize: 30,
  }
});
