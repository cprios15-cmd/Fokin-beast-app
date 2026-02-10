import React, { useEffect, useRef } from 'react';
import { StyleSheet, ImageBackground, Animated, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();
  const dimAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // Start the dim overlay fade animation immediately; navigate after 3s
    Animated.timing(dimAnim, {
      toValue: 0,
      duration: 3000,
      useNativeDriver: true,
    }).start(() => {
      router.push('/(app)');
    });

    return () => {
      dimAnim.stopAnimation();
    };
  }, []);

  // Render only the background and animated dim overlay
  return (
    <ImageBackground source={require('../../assets/fondo1.png')} style={styles.background} resizeMode="cover">
      <View style={styles.loadingWrap} pointerEvents="none">
        <Animated.View style={[styles.loadingDim, { opacity: dimAnim }]} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
  },

  /* ===== CARGANDO ===== */
  loadingWrap: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingDim: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
});
