import { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useAuthStore } from '../src/store/authStore';

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const { isAuthenticated, isLoading, loadSession } = useAuthStore();

  // Cargar sesión al iniciar
  useEffect(() => {
    loadSession();
  }, []);

  // Proteger rutas
  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && segments[0] !== 'login') {
      // Redirigir a login si no está autenticado
      router.replace('/login');
    } else if (isAuthenticated && segments[0] === 'login') {
      // Redirigir a home si ya está autenticado
      router.replace('/(app)');
    }
  }, [isAuthenticated, isLoading, segments]);

  if (isLoading) {
    return null; // O un splash screen
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="(app)" />
    </Stack>
  );
}