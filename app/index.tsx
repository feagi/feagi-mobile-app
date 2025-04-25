import React, { useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Input() {
  useEffect(() => {
    const userLogin = async () => {
      try {
        const apiKey = await AsyncStorage.getItem("userAPIKey");
        if (!apiKey) {
          throw new Error("No apiKey in storage.");
        }

        const response = await fetch(
          "https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=" +
            apiKey
        );

        if (!response.ok) {
          throw new Error(`API request failed with status ${response.status}`);
        }

        const parsed = await response.json();
        const url = parsed.feagi_url;
        await AsyncStorage.setItem("userSession", url);

        if (url) {
          console.log(
            "found API key in storage and got current session. going to godot page"
          );
          router.replace("/godotpage");
        } else {
          console.log("no API key in storage. going to plugin");
          router.replace("/plugin");
        }
      } catch (err) {
        console.error(err);
        router.replace("/plugin");
      }
    };

    userLogin();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={[styles.text, { marginVertical: 20 }]}>FEAGI Monitor</Text>
      <Image
        style={{ width: 200, height: 200 }}
        source={require("../assets/images/brain.png")}
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
