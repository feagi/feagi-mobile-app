import { Pressable, Text, View, StyleSheet, TouchableOpacity, Button, Image, TextInput, Alert } from 'react-native';
import { Link, router } from 'expo-router';
import React, {useEffect, useState} from "react"


export default function Plugin() {

	//ok so make it so they can access the plug in thing

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


