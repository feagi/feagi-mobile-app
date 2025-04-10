import { Text, View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import React, { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
// import LoginHandle from "./LoginHandle";

export default function Input() {
  // const _storeData = async () => {
  //   //await AsyncStorage.setItem('Key1', 'Ben1');
  //   console.log("hrere ok"!);
  //   await AsyncStorage.getItem("Key1", (err, result) => {
  //     console.log(result + "the result");
  //   });
  // };

  const _checkLogin = async () => {
    const userData = await AsyncStorage.getItem("user");
    try {
      if (userData === null) {
        console.log("no key");
        return true;
      } else {
        console.log("userdata: " + userData);
        return false;
      }
    } catch (error) {
      console.log(error);
      console.log("uhhh");
    }
  };

  useEffect(() => {
    const userLogin = async () => {
      let boolCheck = await _checkLogin();
      console.log("boolean " + boolCheck);
      if (await _checkLogin()) {
        console.log("no keys");
        const timer = setTimeout(() => {
          router.replace("/Plugin");
        }, 3000);
        console.log("done");

        return () => clearTimeout(timer);
      } else {
        console.log("yes keys going to godot page");
        router.replace("/GodotPage");
      }
    };
    userLogin();
  }, []);

  //THIS CODE WILL SEARCH THE SAVE API THING

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { marginVertical: 20 }]}>FEAGI Monitor</Text>
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/images/placeholder.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#353839",
  },
  text: {
    color: "white",
    fontSize: 30,
  },
});
