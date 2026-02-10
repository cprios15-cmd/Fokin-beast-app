import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert, BackHandler, Platform, ImageBackground } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../store/habitStore';
import { getIconSource } from '../utils/iconMap';
import { Image } from 'react-native';
import { useAuthStore } from '../store/authStore';

export default function HomeScreen() {
  const router = useRouter();

  const { logout, isLoading: authLoading } = useAuthStore();
  const { habits, loadHabits, removeHabit, isLoading: habitLoading } = useHabitStore();

  useEffect(() => {
    loadHabits().catch(() => {});
  }, []);

  const FIXED_HABITS = [
    { id: '1', name: 'Boca', image: require('../../assets/boca.jpg') },
    { id: '2', name: 'Cama', image: require('../../assets/cama.jpg') },
    { id: '3', name: 'Train', image: require('../../assets/train.jpg') },
    { id: '4', name: 'Brain', image: require('../../assets/brain.jpg') },
  ];

  const goNewRoutine = () => {
    router.push('/(app)/habits/new');
  };

  const handleExitApp = async () => {
    try {
      await logout();
    } catch {}

    if (Platform.OS === 'android') {
      BackHandler.exitApp();
    } else {
      // On iOS we can't programmatically close the app; navigate to login instead
      router.replace('/login');
      Alert.alert('Salir', 'Sesión cerrada. Usa el botón de inicio para salir de la app.');
    }
  };

  const onDeleteHabit = (id: string) => {
    Alert.alert('Borrar hábito', '¿Seguro que quieres borrar este hábito?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Borrar',
        style: 'destructive',
        onPress: async () => {
          try {
            await removeHabit(id);
          } catch {
            Alert.alert('Error', 'No se pudo borrar el hábito.');
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.root}>
      <ImageBackground source={require('../../assets/fondo_home.png')} style={styles.screen} resizeMode="cover">
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.habitGrid}>
            {FIXED_HABITS.map((h) => (
              <TouchableOpacity key={h.id} style={styles.habitTile} activeOpacity={0.85}>
                <Image source={h.image} style={styles.tileImage} />
                <View style={styles.tileLabelBg}>
                  <Text style={styles.tileLabel}>{h.name}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { padding: 20, paddingBottom: 110 },

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
  habitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.45)',
    borderWidth: 1,
    borderColor: 'rgba(177,18,27,0.35)',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  habitLeft: { flexDirection: 'row', alignItems: 'center' },
  habitIcon: { fontSize: 28, marginRight: 12, color: '#ff7a2d' },
  habitIconImg: { width: 28, height: 28, marginRight: 12, resizeMode: 'contain' },
  habitLabel: { color: '#ffbf7a', fontSize: 16, fontWeight: '800' },
  habitMeta: { color: '#8b8b8b', fontSize: 12 },

  habitGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  habitTile: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#111',
  },
  tileImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  tileLabelBg: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingVertical: 8,
    paddingHorizontal: 10,
  },
  tileLabel: {
    color: '#ffbf7a',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
  },

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
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#b1121b',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 6,
  },
  fabText: { color: '#fff', fontSize: 32, lineHeight: 36, fontWeight: '900' },
});
