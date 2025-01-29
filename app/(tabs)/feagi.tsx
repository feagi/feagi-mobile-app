import { ThemedText } from "@/components/ThemedText";
import { ScrollView, StyleSheet, useColorScheme, View } from "react-native";
import WebView from "react-native-webview";

export default function Feagi() {
  const colorScheme = useColorScheme() ?? "light";

  return (
    <ScrollView
      style={[
        styles.parentContainer,
        { backgroundColor: colorScheme === "light" ? "#fff" : "#000" },
      ]}
    >
      <ThemedText type="title" style={styles.title}>
        FEAGI 🧠!
      </ThemedText>
      <View style={{ height: 600 }}>
        <WebView
          originWhitelist={["*"]}
          source={require("../assets/feagi/test.html")}
          // source={{ uri: "https://storage.googleapis.com/nrs_brain_visualizer/1738016771/index.html?ip_address=user-bychgwykbenhsgwqxtnh-feagi.feagi-k8s-production.neurorobotics.studio&port_disabled=true&websocket_url=wss://user-bychgwykbenhsgwqxtnh-feagi.feagi-k8s-production.neurorobotics.studio/p9050&http_type=HTTPS://" }}
          // ❗ NOTE: The below values, and originWhitelist above, are in place to be ultra-permissive to pinpoint display/interaction issues. They should be altered/eliminated where unneeded or security-vulnerable
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          allowFileAccess={true}
          allowUniversalAccessFromFileURLs={true}
          allowFileAccessFromFileURLs={true}
          mediaPlaybackRequiresUserAction={false}
          scalesPageToFit={true}
          bounces={false}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  parentContainer: {
    paddingTop: 70,
  },
  title: {
    marginBottom: 10,
    textAlign: "center",
  },
});
