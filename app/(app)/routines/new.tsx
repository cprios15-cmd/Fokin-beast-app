import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useRoutineStore } from '../../../src/store/routineStore';

export default function NewRoutineScreen() {
  const router = useRouter();
  const { addRoutine, isLoading } = useRoutineStore();

  const [routineName, setRoutineName] = useState('');

  const [exerciseName, setExerciseName] = useState('');
  const [weight, setWeight] = useState('');
  const [sets, setSets] = useState('');
  const [reps, setReps] = useState('');
  const [rest, setRest] = useState('');
  const [rir, setRir] = useState('');

  const [exercises, setExercises] = useState<any[]>([]);

  const addExercise = () => {
    if (!exerciseName.trim()) {
      Alert.alert('Error', 'Pon el nombre del ejercicio');
      return;
    }

    setExercises((prev) => [
      ...prev,
      {
        name: exerciseName.trim(),
        weight: Number(weight) || 0,
        sets: Number(sets) || 0,
        reps: Number(reps) || 0,
        restSec: Number(rest) || 0,
        rir: Number(rir) || 0,
      },
    ]);

    setExerciseName('');
    setWeight('');
    setSets('');
    setReps('');
    setRest('');
    setRir('');
  };

  const saveRoutine = async () => {
    if (!routineName.trim()) {
      Alert.alert('Error', 'Pon un nombre a la rutina');
      return;
    }

    if (exercises.length === 0) {
      Alert.alert('Error', 'Añade al menos un ejercicio');
      return;
    }

    try {
      await addRoutine({
        name: routineName.trim(),
        exercises,
      });
      router.back();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la rutina');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      <Text style={styles.title}>Nueva rutina</Text>

      <TextInput
        style={styles.input}
        placeholder="Nombre de la rutina"
        placeholderTextColor="#666"
        value={routineName}
        onChangeText={setRoutineName}
      />

      <View style={styles.divider} />

      <Text style={styles.subtitle}>Añadir ejercicio</Text>

      <TextInput
        style={styles.input}
        placeholder="Ejercicio"
        placeholderTextColor="#666"
        value={exerciseName}
        onChangeText={setExerciseName}
      />

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="Peso"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={weight}
          onChangeText={setWeight}
        />
        <TextInput
          style={[styles.input, styles.half]}
          placeholder="RIR"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={rir}
          onChangeText={setRir}
        />
      </View>

      <View style={styles.row}>
        <TextInput
          style={[styles.input, styles.third]}
          placeholder="Series"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={sets}
          onChangeText={setSets}
        />
        <TextInput
          style={[styles.input, styles.third]}
          placeholder="Reps"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={reps}
          onChangeText={setReps}
        />
        <TextInput
          style={[styles.input, styles.third]}
          placeholder="Desc (s)"
          placeholderTextColor="#666"
          keyboardType="numeric"
          value={rest}
          onChangeText={setRest}
        />
      </View>

      <TouchableOpacity style={styles.addBtn} onPress={addExercise}>
        <Text style={styles.addText}>Añadir ejercicio</Text>
      </TouchableOpacity>

      <View style={styles.divider} />

      <Text style={styles.subtitle}>Ejercicios añadidos</Text>

      {exercises.map((e, i) => (
        <View key={i} style={styles.card}>
          <Text style={styles.cardTitle}>{e.name}</Text>
          <Text style={styles.cardMeta}>
            {e.sets}x{e.reps} · {e.weight}kg · {e.restSec}s · RIR {e.rir}
          </Text>
        </View>
      ))}

      <TouchableOpacity style={styles.saveBtn} onPress={saveRoutine} disabled={isLoading}>
        <Text style={styles.saveText}>Guardar rutina</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#0b0b0b' },
  container: { padding: 20, paddingBottom: 40 },

  title: { color: '#fff', fontSize: 24, fontWeight: '900', marginBottom: 14 },
  subtitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 10 },

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

  row: { flexDirection: 'row', gap: 10 },
  half: { flex: 1 },
  third: { flex: 1 },

  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.06)', marginVertical: 14 },

  addBtn: {
    borderWidth: 1,
    borderColor: '#b1121b',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  addText: { color: '#b1121b', fontWeight: '900' },

  card: {
    backgroundColor: '#111',
    borderRadius: 10,
    padding: 12,
    marginBottom: 8,
  },
  cardTitle: { color: '#fff', fontWeight: '900' },
  cardMeta: { color: '#8b8b8b', fontSize: 12 },

  saveBtn: {
    backgroundColor: '#b1121b',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 16,
  },
  saveText: { color: '#0b0b0b', fontWeight: '900', letterSpacing: 1.5 },
});
