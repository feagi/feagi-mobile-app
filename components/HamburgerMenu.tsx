import React, { useState } from "react";
import { Animated, ScrollView, Text, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import HelpModal from "./HelpModal";
import { Ionicons } from "@expo/vector-icons";
import { StyleSheet } from "react-native";

interface HamburgerMenuProps {
  menuVisible: boolean;
  setMenuVisible: React.Dispatch<React.SetStateAction<boolean>>;
  setMobileSettingsModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  slideAnim: Animated.Value;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({
  menuVisible,
  setMenuVisible,
  setMobileSettingsModalVisible,
  slideAnim,
}) => {
  const [helpModalVisible, setHelpModalVisible] = useState(false); // State for Help Modal

  const closeMenu = () => {
    if (menuVisible) {
      Animated.timing(slideAnim, {
        toValue: -250,
        duration: 300,
        useNativeDriver: true,
      }).start();

      setMenuVisible(false);
    }
  };

  return (
    <>
      {/* Close the menu when clicking outside */}
      {menuVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeMenu}
        />
      )}

      {/* Close the modal when clicking outside or close button */}
      <HelpModal
        visible={helpModalVisible}
        onClose={() => setHelpModalVisible(false)}
      />

      <Animated.View
        style={[
          styles.menuContainer,
          {
            transform: [{ translateX: slideAnim }],
          },
        ]}
      >
        <ScrollView contentContainerStyle={styles.menuScrollContainer}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/corticalControl");
              closeMenu();
            }}
          >
            <Ionicons name="hand-left-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Cortical Controls</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/brainSettings");
              closeMenu();
            }}
          >
            <Ionicons name="bulb-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Brain Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/inputSettings");
              closeMenu();
            }}
          >
            <Ionicons name="enter-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Input Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/outputSettings");
              closeMenu();
            }}
          >
            <Ionicons name="log-out-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Output Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              closeMenu(), setMobileSettingsModalVisible(true);
            }}
          >
            <Ionicons name="cog-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Mobile Settings</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => {
              router.push("/connectivitySettings");
              closeMenu();
            }}
          >
            <Ionicons name="wifi-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Connectivity</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => setHelpModalVisible(true)} // Show Help Modal
          >
            <Ionicons name="help-outline" size={24} color="white" />
            <Text style={styles.menuItemText}>Help</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </>
  );
};

export default HamburgerMenu;

const styles = StyleSheet.create({
  menuContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 250,
    height: "100%",
    backgroundColor: "#2e2e2e",
    paddingTop: 50,
    zIndex: 2,
  },

  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },

  menuItemText: {
    color: "white",
    fontSize: 18,
    marginLeft: 10,
  },

  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1,
  },

  menuScrollContainer: {
    flexGrow: 1,
    paddingBottom: 20,
  },

  modalText: {
    color: "white",
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
