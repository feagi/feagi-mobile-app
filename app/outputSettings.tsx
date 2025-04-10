import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

const OutputSettingsPage = () => {
  const router = useRouter();

  //Go back to godotpage
  const goBack = () => {
    router.push("/GodotPage");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Output Settings</Text>
        <TouchableOpacity onPress={goBack} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.noSettingsText}>No settings available</Text>
      </ScrollView>

      <TouchableOpacity style={styles.cancelButton} onPress={goBack}>
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0A1A3A",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0A1A3A",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    flex: 1,
    textAlign: "center",
  },
  closeButton: {
    padding: 5,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  noSettingsText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center",
  },
  cancelButton: {
    backgroundColor: "#81D4FB",
    padding: 15,
    borderRadius: 10,
    margin: 20,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#0A1A3A",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OutputSettingsPage;
