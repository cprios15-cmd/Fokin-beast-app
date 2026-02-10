import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useHabitStore } from '../../../src/store/habitStore';
import { ICONS } from '../../../src/utils/iconMap';

export default function NewHabitScreen() {
  const router = useRouter();
  const { addHabit, isLoading } = useHabitStore();

  const [name, setName] = useState('');
  const [icon, setIcon] = useState<string | undefined>(undefined);
  const [times, setTimes] = useState('1');

  const save = async () => {
    if (!name.trim()) return Alert.alert('Error', 'Pon un nombre');
    const timesNum = Math.max(1, Number(times) || 1);

    try {
      await addHabit({ name: name.trim(), icon: icon, timesPerDay: timesNum });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar el hábito');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nuevo hábito</Text>

      <TextInput style={styles.input} placeholder="Nombre del hábito" placeholderTextColor="#666" value={name} onChangeText={setName} />

      <Text style={{ color: '#fff', fontWeight: '800', marginBottom: 8 }}>Elige un icono</Text>
      <View style={styles.iconGrid}>
        {ICONS.map((ic) => (
          <TouchableOpacity
            key={ic.key}
            style={[styles.iconCell, icon === ic.key && styles.iconSelected]}
            onPress={() => setIcon(ic.key)}
            activeOpacity={0.85}
          >
            <Image source={ic.src} style={styles.iconImage} />
          </TouchableOpacity>
        ))}
      </View>

      <TextInput style={styles.input} placeholder="Veces por día" placeholderTextColor="#666" keyboardType="numeric" value={times} onChangeText={setTimes} />

      <TouchableOpacity style={styles.saveBtn} onPress={save} disabled={isLoading}>
        <Text style={styles.saveText}>{isLoading ? 'Guardando...' : 'Guardar hábito'}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { padding: 20, paddingBottom: 40 },
  title: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 14 },
  input: {
    backgroundColor: '#111',
    borderWidth: 1,
    borderColor: 'rgba(177,18,27,0.6)',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: '#ddd',
    marginBottom: 12,
  },
  iconGrid: { flexDirection: 'row', gap: 10, marginBottom: 12 },
  iconCell: {
    width: 64,
    height: 64,
    borderRadius: 10,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSelected: {
    borderWidth: 2,
    borderColor: '#ff7a2d',
  },
  iconImage: { width: 40, height: 40, resizeMode: 'contain' },
  saveBtn: {
    backgroundColor: '#b1121b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: { color: '#0b0b0b', fontWeight: '900' },
});
