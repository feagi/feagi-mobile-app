import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>

      <Stack.Screen name="index" options={{ title: "Loading...", headerShown: false }} />
      <Stack.Screen name="plugin" options={{ title: "Add Link", headerShown: false }} />
      <Stack.Screen name="signin" options={{ title: "Sign In", headerShown: false }} />
      <Stack.Screen name="godotpage" options={{ title: "Main Page", headerShown: false }} />
      <Stack.Screen name="corticalControl" options={{ title: "cortical control", headerShown: false }} />
      <Stack.Screen name="outputSettings" options={{ title: "output settings", headerShown: false }} />
      <Stack.Screen name="inputSettings" options={{ title: "input settings", headerShown: false }} />
      <Stack.Screen name="brainSettings" options={{ title: "brain settings", headerShown: false }} />
      <Stack.Screen name="connectivitySettings" options={{ title: "connectivity settings", headerShown: false }} />
    </Stack>
  );
}

