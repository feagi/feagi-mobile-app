import { Text, View, StyleSheet, TextInput, Pressable } from "react-native";
import { Link } from "expo-router";
import React, { useState } from "react";

export default function Index() {
  const [text, setText] = useState("");
  const [number, setNumber] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [apiText, setApiText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{number}</Text>
      <TextInput
        style={styles.text}
        placeholderTextColor="gray"
        onChangeText={setText}
        value={text}
      />

      <Text style={styles.text}>{apiKey}</Text>
      <Text style={styles.text}>{apiText}</Text>

      <Link replace href="/Input" asChild>
        <Pressable>
          <Text style={[styles.text, { margin: 30, fontSize: 20 }]}>
            Click To Start Project Demo
          </Text>
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
    backgroundColor: "#353839",
  },
  text: {
    color: "white",
  },
});
