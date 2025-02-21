import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home", headerShown: false }} />
      <Stack.Screen name="input" options={{ title: "Loading...", headerShown: false }} />
      <Stack.Screen name="plugin" options={{ title: "Add Link", headerShown: false }} />
      <Stack.Screen name="signin" options={{ title: "Sign In", headerShown: false }} />
      <Stack.Screen name="godotpage" options={{ title: "Main Page", headerShown: false }} />
      <Stack.Screen name="brainUnplugged" options={{ title: "Brain Unplugged", headerShown: false }} />
      <Stack.Screen name="brainMonitor" options={{ title: "Brain Monitor", headerShown: false }} />


    </Stack>
  );
}

