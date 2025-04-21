import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from "react-native";
import { router } from "expo-router";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";

const ConnectivitySettings: React.FC = () => {
  const [networkInput, setNetworkInput] = useState<string>("");
  const [magicLink, setMagicLink] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [currentLink, setCurrentLink] = useState<string>("");

  useEffect(() => {
    const loadCurrentLink = async () => {
      try {
        const storedLink = await AsyncStorage.getItem("user");
        if (storedLink) {
          setCurrentLink(storedLink);
        }
      } catch (error) {
        console.error("Failed to load stored link:", error);
      }
    };

    loadCurrentLink();
  }, []);

  // API call function
  const apiCall = async (api: string): Promise<void> => {
    if (!api) {
      Alert.alert("Error", "Please enter an API Key");
      return;
    }

    setIsLoading(true);
    setApiResponse("Connecting...");

    try {
      // Clear existing data before setting new API key
      await AsyncStorage.getAllKeys().then((keys) => {
        AsyncStorage.multiRemove(keys);
      });

      // console.log("https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=" + api);
      const response = await fetch(
        "https://us-prd-composer.neurorobotics.studio/v1/public/regional/magic/feagi_session?token=" +
          api
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const json = await response.json();
      console.log("response:", json);
      setMagicLink(json.feagi_url);
      console.log("feagi url: " + json.feagi_url);
      await AsyncStorage.setItem("user", json.feagi_url.toString());
      setCurrentLink(json.feagi_url);
      setApiResponse("Connection successful!");

      // Navigate back to the main view after a short delay
      setTimeout(() => {
        router.replace("/godotpage");
      }, 1000);
    } catch (error) {
      console.error(error);
      console.log("oh boy");
      setApiResponse("Connection failed!");
    } finally {
      setIsLoading(false);
    }
  };

  // Delete existing stored connection
  const deleteStoredKey = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem("user");
      setCurrentLink("");
      setMagicLink("");
      setApiResponse("");
      Alert.alert("Success", "Stored connection deleted successfully");
      setNetworkInput("");
    } catch (error) {
      console.error("Error deleting stored connection:", error);
      Alert.alert("Error", "Failed to delete stored connection");
    }
  };

  // Delete all AsyncStorage keys
  const deleteKeys = () => {
    AsyncStorage.getAllKeys((err, keys) => {
      AsyncStorage.multiGet(keys, (err, stores) => {
        stores.map((result, i, store) => {
          // get at each store's key/value so you can work with it
          console.log("deleting: ");
          let key = store[i][0];
          let value = store[i][1];
          console.log("key: " + key + " Value: " + value);
          AsyncStorage.removeItem(key);
        });
      });
    });
    console.log("Success", "All stored data deleted successfully");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Network Configuration</Text>

      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => router.back()}
      >
        <Ionicons name="close" size={24} color="white" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Enter API Key"
        placeholderTextColor="gray"
        onChangeText={setNetworkInput}
        value={networkInput}
        autoCapitalize="none"
      />

      <TouchableOpacity
        style={styles.connectButton}
        onPress={() => apiCall(networkInput)}
        disabled={isLoading}
      >
        <Text style={styles.buttonText}>Connect</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.deleteKeysButton} onPress={deleteKeys}>
        <Text style={styles.deleteButtonText}>Delete Key</Text>
      </TouchableOpacity>

      {magicLink ? (
        <Text style={styles.info}>{"MagicLink: " + magicLink}</Text>
      ) : null}

      {apiResponse ? (
        <Text
          style={[
            styles.info,
            apiResponse.includes("failed")
              ? styles.errorText
              : apiResponse.includes("successful")
              ? styles.successText
              : styles.infoText,
          ]}
        >
          {"API Connection: " + apiResponse}
        </Text>
      ) : null}

      <ScrollView style={styles.instructionsContainer}>
        <Text style={styles.instructionsHeader}>Instructions:</Text>

        <Text style={styles.sectionHeader}>Self Hosted:</Text>
        <Text style={styles.instructionText}>......</Text>
        <Text style={styles.instructionText}>.......</Text>

        <Text style={styles.sectionHeader}>Neurorobotics Studio:</Text>
        <Text style={styles.instructionText}>
          1) login at www.neurorobotics.studio
        </Text>
        <Text style={styles.instructionText}>
          2) Obtain your API Key from Neurorobotics
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#0A1A3A",
    padding: 20,
  },
  header: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  closeButton: {
    position: "absolute",
    top: 20,
    right: 20,
    padding: 5,
    zIndex: 10,
  },
  input: {
    width: "100%",
    color: "white",
    fontSize: 20,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    padding: 10,
  },
  connectButton: {
    height: 60,
    width: 200,
    backgroundColor: "#81D4FA",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#2e3133",
    marginBottom: 10,
  },
  buttonText: {
    color: "#0A1A3A",
    fontSize: 20,
    fontWeight: "700",
  },
  deleteKeysButton: {
    height: 50,
    width: 200,
    backgroundColor: "#FF6347",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    borderWidth: 3,
    borderColor: "#2e3133",
    marginBottom: 20,
  },
  deleteButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "700",
  },
  info: {
    color: "white",
    fontSize: 16,
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    alignItems: "flex-end",
    margin: 10,
    width: "100%",
  },
  errorText: {
    color: "#FF6347",
  },
  successText: {
    color: "#90EE90",
  },
  infoText: {
    color: "#FFF8DC",
  },
  instructionsContainer: {
    flex: 1,
    width: "100%",
  },
  instructionsHeader: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionHeader: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },
  instructionText: {
    color: "white",
    fontSize: 16,
    marginBottom: 5,
  },
});

export default ConnectivitySettings;
