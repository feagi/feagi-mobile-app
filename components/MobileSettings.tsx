import React from "react";
import { Switch } from "react-native-gesture-handler";
import { Text, View, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Inputs, UpdateInput } from "@/types/inputs";

type MobileSettingsProps = {
  inputs: Inputs;
  updateInput: UpdateInput;
  cancelSensoryData: () => void;
  updateSensoryData: () => void;
  mobileSettingsModalVisible: boolean;
  setMobileSettingsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
};

const MobileSettings: React.FC<MobileSettingsProps> = ({
  inputs,
  updateInput,
  cancelSensoryData,
  updateSensoryData,
  mobileSettingsModalVisible,
  setMobileSettingsModalVisible,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={mobileSettingsModalVisible}
      // onOrientationChange={(orientation) => {
      //   setCurrentOrientation(orientation);
      // }}
      supportedOrientations={["portrait", "landscape"]}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.fixedModalContainer}>
          {/* Header section */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Mobile Settings</Text>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setMobileSettingsModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View style={styles.divider} />

          {/* Settings section */}
          <View style={styles.settingsWrapper}>
            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Mobile Camera</Text>
              <Switch
                value={inputs.camera.slider}
                onValueChange={(value) =>
                  updateInput("camera", { slider: value })
                }
                trackColor={{ false: "#767577", true: "#81D4FA" }}
                thumbColor={inputs.camera.slider ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Mobile Gyroscope</Text>
              <Switch
                value={inputs.gyro.slider}
                onValueChange={(value) =>
                  updateInput("gyro", { slider: value })
                }
                trackColor={{ false: "#767577", true: "#81D4FA" }}
                thumbColor={inputs.gyro.slider ? "#fff" : "#f4f3f4"}
              />
            </View>

            <View style={styles.settingItem}>
              <Text style={styles.settingLabel}>Mobile Accelerometer</Text>
              <Switch
                value={inputs.accel.slider}
                onValueChange={(value) =>
                  updateInput("accel", { slider: value })
                }
                trackColor={{ false: "#767577", true: "#81D4FA" }}
                thumbColor={inputs.accel.slider ? "#fff" : "#f4f3f4"}
              />
            </View>
          </View>

          {/* Button section */}
          <View style={styles.fixedButtonRow}>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                cancelSensoryData();
                // setMobileSettingsModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => {
                updateSensoryData();
                // setMobileSettingsModalVisible(false);
              }}
            >
              <Text style={styles.buttonText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default MobileSettings;

const styles = StyleSheet.create({
  applyButton: {
    backgroundColor: "#81D4FA",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginLeft: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "#0A1A3A",
    fontSize: 18,
    fontWeight: "bold",
  },

  cancelButton: {
    backgroundColor: "#81D4FA",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginRight: 10,
    alignItems: "center",
  },

  closeButton: {
    padding: 5,
  },

  fixedButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },

  fixedModalContainer: {
    width: "85%",
    backgroundColor: "#0A1A3A",
    borderRadius: 20,
    padding: 20,
    height: "auto",
    minWidth: 250,
    minHeight: 250,
    maxWidth: 500,
    maxHeight: 400,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },

  divider: {
    height: 1,
    backgroundColor: "#555",
    marginBottom: 15,
    width: "100%",
  },

  settingsWrapper: {
    marginBottom: 20,
  },

  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#444",
  },

  settingLabel: {
    fontSize: 16,
    color: "#fff",
    flex: 1,
    marginRight: 10,
  },
});
