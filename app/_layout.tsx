import { Stack } from 'expo-router';

export default function RootLayout() {
  // Start directly with login; no session hydration needed since it auto-navigates after 3s
  return (
    <Stack screenOptions={{ headerShown: false }} initialRouteName="login">
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
