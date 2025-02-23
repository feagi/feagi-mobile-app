import { Pressable, Text, View, Button, StyleSheet, Image, TextInput } from 'react-native';
import { Link, router } from 'expo-router';
import React, {useEffect, useState} from "react"


export default function Input() {

    useEffect(() => {
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
