import { Pressable, Text, View, StyleSheet, Image, TextInput, useEffect } from 'react-native';
import { Link, router } from 'expo-router';
import * as React from 'react';


export default function Input() {

    React.useEffect(() => {
        const timer = setTimeout(() => {

            router.replace('/');

            }, 3000);
		console.log("done");
		return () => clearTimeout(timer);

    }, [])

    return (
    <View

    style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        }}
    >
	<Text style={{fontSize: 40, marginVertical: 20}}>FEAGI Monitor</Text>
	<Image style={{width: 200, height: 200}} source={require('../assets/images/placeholder.png')} />


    </View>
    );
}

export default Input