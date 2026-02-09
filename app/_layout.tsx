import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();

  const { isAuthenticated, isLoading, loadSession } = useAuthStore();

  useEffect(() => {
    loadSession();
  }, [loadSession]);

  useEffect(() => {
    if (isLoading) return;

    const inLogin = segments[0] === 'login';

    if (!isAuthenticated && !inLogin) {
      router.replace('/login');
    } else if (isAuthenticated && inLogin) {
      router.replace('/(app)');
    }
  }, [isAuthenticated, isLoading, segments, router]);

  if (isLoading) return null;

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}
