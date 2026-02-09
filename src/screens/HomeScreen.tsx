import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthStore } from '../store/authStore';
import { useRoutineStore } from '../store/routineStore';

export default function HomeScreen() {
  const router = useRouter();

  const { user, logout, isLoading: authLoading } = useAuthStore();
  const { routines, loadRoutines, removeRoutine, isLoading: routineLoading } = useRoutineStore();

  useEffect(() => {
    loadRoutines().catch(() => {
      // silencioso; si quieres, alerta aquí
    });
  }, []);

  const goNewRoutine = () => {
    router.push('/(app)/routines/new');
  };

  const onDeleteRoutine = (id: string) => {
    Alert.alert('Borrar rutina', '¿Seguro que quieres borrar esta rutina?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeRoutine(id);
          } catch {
            Alert.alert('Error', 'No se pudo borrar la rutina.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>¡Bienvenido! 🎉</Text>
      <Text style={styles.subtitle}>Hola, {user?.name}</Text>
      <Text style={styles.info}>Usuario: {user?.username}</Text>
      <Text style={styles.info}>Rol: {user?.role}</Text>

      {/* ===== CTA Registrar rutina ===== */}
      <TouchableOpacity style={styles.primaryBtn} onPress={goNewRoutine} activeOpacity={0.85}>
        <Text style={styles.primaryBtnText}>Registrar rutina</Text>
      </TouchableOpacity>

      {/* ===== Lista de rutinas ===== */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tus rutinas</Text>

        {routineLoading ? (
          <Text style={styles.muted}>Cargando rutinas…</Text>
        ) : routines.length === 0 ? (
          <Text style={styles.muted}>Aún no tienes rutinas. Crea la primera 👇</Text>
        ) : (
          <View style={styles.list}>
            {routines.map((r) => (
              <View key={r.id} style={styles.card}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{r.name}</Text>
                  <Text style={styles.cardMeta}>
                    {r.exercises?.length ?? 0} ejercicios · {new Date(r.createdAt).toLocaleDateString()}
                  </Text>
                </View>

                <TouchableOpacity
                  onPress={() => onDeleteRoutine(r.id)}
                  style={styles.deleteBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.deleteText}>Borrar</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* ===== Logout ===== */}
      <TouchableOpacity
        style={[styles.logoutBtn, authLoading && { opacity: 0.6 }]}
        onPress={logout}
        disabled={authLoading}
        activeOpacity={0.85}
      >
        <Text style={styles.logoutText}>{authLoading ? 'Cerrando...' : 'Cerrar Sesión'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { padding: 20, paddingBottom: 40 },

  title: { fontSize: 28, fontWeight: '900', marginBottom: 6, color: '#fff' },
  subtitle: { fontSize: 16, color: '#cfcfcf', marginBottom: 10 },
  info: { fontSize: 13, color: '#8b8b8b', marginBottom: 4 },

  primaryBtn: {
    backgroundColor: '#b1121b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 18,
  },
  primaryBtnText: { color: '#0b0b0b', fontSize: 16, fontWeight: '900', letterSpacing: 1.5 },

  section: { marginTop: 24 },
  sectionTitle: { color: '#fff', fontSize: 16, fontWeight: '900', marginBottom: 10 },
  muted: { color: '#666' },

  list: { gap: 10 },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    borderRadius: 12,
    padding: 12,
  },
  cardTitle: { color: '#fff', fontWeight: '900', fontSize: 14, marginBottom: 2 },
  cardMeta: { color: '#8b8b8b', fontSize: 12 },

  deleteBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: 'rgba(177,18,27,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(177,18,27,0.35)',
    marginLeft: 10,
  },
  deleteText: { color: '#b1121b', fontWeight: '900', fontSize: 12 },

  logoutBtn: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 26,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  logoutText: { color: '#ff3b30', fontSize: 16, fontWeight: '800' },
});
