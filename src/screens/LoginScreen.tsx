import React, { useRef, useState } from 'react';
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Animated,
  Vibration,
  Platform,
} from 'react-native';
import { useFonts } from 'expo-font';
import { useAuthStore } from '../store/authStore';

export default function LoginScreen() {
  /* ===== FUENTE SOLO PARA LOGIN ===== */
  const [fontsLoaded] = useFonts({
    LoginFont: require('../../assets/fonts/Cinzel-Regular.ttf'),
  });

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const DEBUG_LAYOUT = true; // ⬅️ ponlo en false cuando acabes


  const login = useAuthStore((s) => s.login);
  const isLoading = useAuthStore((s) => s.isLoading);

  /* ===== FLASH ROJO ===== */
  const errorFlash = useRef(new Animated.Value(0)).current;

  if (!fontsLoaded) return null;

  const triggerErrorEffect = () => {
    // 🔴 Flash rojo pantalla completa
    Animated.sequence([
      Animated.timing(errorFlash, {
        toValue: 0.55,
        duration: 70,
        useNativeDriver: true,
      }),
      Animated.timing(errorFlash, {
        toValue: 0,
        duration: 240,
        useNativeDriver: true,
      }),
    ]).start();

    // 📳 Vibración
    try {
      Vibration.vibrate(Platform.OS === 'ios' ? 40 : [0, 20, 40, 20]);
    } catch {}
  };

  const handleLogin = async () => {
    if (!username || !password) {
      triggerErrorEffect();
      return;
    }

    try {
      await login(username, password);
    } catch {
      triggerErrorEffect();
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/fondo_login.png')}
      style={styles.background}
      resizeMode="cover"
    >
      {/* OVERLAY ROJO */}
      <Animated.View
        pointerEvents="none"
        style={[
          styles.errorOverlay,
          { opacity: errorFlash },
        ]}
      />

      {/* ===== INPUT USUARIO ===== */}
      <TextInput
        value={username}
        onChangeText={setUsername}
        editable={!isLoading}
        autoCapitalize="none"
        autoCorrect={false}
        caretHidden
        selectionColor="transparent"
        style={styles.usernameInput}
      />

      {/* ===== INPUT PASSWORD ===== */}
      <TextInput
        value={password}
        onChangeText={setPassword}
        editable={!isLoading}
        secureTextEntry
        caretHidden
        selectionColor="transparent"
        style={styles.passwordInput}
      />

      {/* ===== BOTÓN LOGIN (INVISIBLE) ===== */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
        disabled={isLoading}
        activeOpacity={0.85}
      />
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  /* ===== OVERLAY ERROR ===== */
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(177,18,27,0.85)',
  },

  /* ===== INPUTS ===== */

  usernameInput: {
    position: 'absolute',
    left: '12.2%',
    right: '12%',
    top: '45.8%',
    height: 58.5,
    paddingLeft: 65,
    paddingTop: 5,
    color: '#686767',
    fontSize: 16,
    fontFamily: 'LoginFont',
    backgroundColor:  'rgba(255,0,0,0.15)',
    borderWidth: 1,
    borderColor: 'red' ,
  },

  passwordInput: {
    position: 'absolute',
    left: '12.2%',
    right: '12%',
    top: '54.4%',
    height: 58,
    paddingLeft: 65,
    paddingTop: 32,
    color: '#686767',
    fontSize: 22,
    fontFamily: 'LoginFont',
        backgroundColor:  'rgba(255,0,0,0.15)',
    borderWidth: 1,
    borderColor: 'red' ,
  },

  /* ===== BOTÓN ===== */

  loginButton: {
    position: 'absolute',
    left: '22%',
    right: '22%',
    top: '64%',
    height: 45,
    backgroundColor:  'transparent',
  },
});
