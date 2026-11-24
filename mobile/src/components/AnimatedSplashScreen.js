import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Easing,
  Dimensions,
  StatusBar,
  Platform
} from 'react-native';
import Ionicons from './Icon';

const { width, height } = Dimensions.get('screen');
const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export default function AnimatedSplashScreen({ onFinish }) {
  const scaleAnim = useRef(new Animated.Value(0.75)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const exitAnim = useRef(new Animated.Value(1)).current;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  const [loadingStep, setLoadingStep] = useState('Securing financial vault...');
  const [percentText, setPercentText] = useState('0%');

  useEffect(() => {
    // 1. Entrance animation (scale + fade in)
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 650,
        easing: Easing.out(Easing.back(1.4)),
        useNativeDriver: USE_NATIVE_DRIVER
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 550,
        useNativeDriver: USE_NATIVE_DRIVER
      })
    ]).start();

    // 2. Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: USE_NATIVE_DRIVER
        })
      ])
    ).start();

    // 3. Progress bar animation
    Animated.timing(progressAnim, {
      toValue: 1,
      duration: 1500,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false
    }).start();

    // Status step messages
    const t1 = setTimeout(() => {
      setLoadingStep('Connecting to Neon PostgreSQL...');
      setPercentText('45%');
    }, 450);

    const t2 = setTimeout(() => {
      setLoadingStep('Calculating real-time balances...');
      setPercentText('85%');
    }, 1000);

    const t3 = setTimeout(() => {
      setLoadingStep('Ready!');
      setPercentText('100%');
    }, 1500);

    // 4. Smooth exit fade out
    const t4 = setTimeout(() => {
      Animated.timing(exitAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.in(Easing.ease),
        useNativeDriver: USE_NATIVE_DRIVER
      }).start(() => {
        if (onFinishRef.current) onFinishRef.current();
      });
    }, 1800);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [exitAnim, fadeAnim, progressAnim, pulseAnim, scaleAnim]);

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%']
  });

  return (
    <Animated.View style={[styles.container, { opacity: exitAnim }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D1117" />

      {/* Decorative ambient background glows */}
      <View style={styles.glowCircle1} />
      <View style={styles.glowCircle2} />

      <Animated.View
        style={[
          styles.contentWrap,
          {
            opacity: fadeAnim,
            transform: [{ scale: Animated.multiply(scaleAnim, pulseAnim) }]
          }
        ]}
      >
        {/* 3D Tactile Executive Logo Coin */}
        <View style={styles.clayLogoCoin}>
          <Ionicons name="wallet" size={46} color="#FFFFFF" />
        </View>

        {/* Brand Typography */}
        <Text style={styles.brandTitle}>Budget Tracker</Text>
        <Text style={styles.brandSubtitle}>Monthly Financial Vault</Text>
      </Animated.View>

      {/* Bottom Loading Progress Bar */}
      <Animated.View style={[styles.progressSection, { opacity: fadeAnim }]}>
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
        </View>

        <View style={styles.progressStatusRow}>
          <Text style={styles.statusText}>{loadingStep}</Text>
          <Text style={styles.percentText}>{percentText}</Text>
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: Platform.OS === 'web' ? '100%' : width,
    height: Platform.OS === 'web' ? '100%' : height,
    backgroundColor: '#000000', // Pitch Black Canvas
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999999
  },
  glowCircle1: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(30, 58, 138, 0.25)'
  },
  glowCircle2: {
    position: 'absolute',
    bottom: -80,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: 'rgba(220, 38, 38, 0.20)'
  },
  contentWrap: {
    alignItems: 'center',
    marginBottom: 80
  },
  clayLogoCoin: {
    width: 98,
    height: 98,
    borderRadius: 32,
    backgroundColor: '#0A192F',
    borderTopWidth: 3,
    borderLeftWidth: 2,
    borderRightWidth: 1.5,
    borderBottomWidth: 6,
    borderTopColor: '#2563EB',
    borderLeftColor: '#2563EB',
    borderRightColor: 'rgba(0, 0, 0, 0.3)',
    borderBottomColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.55,
    shadowRadius: 22,
    elevation: 10
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -0.6
  },
  brandSubtitle: {
    color: 'rgba(255, 255, 255, 0.82)',
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    letterSpacing: 0.3
  },
  progressSection: {
    position: 'absolute',
    bottom: 60,
    width: Math.min(width - 64, 320),
    alignItems: 'center'
  },
  progressTrack: {
    width: '100%',
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    overflow: 'hidden',
    marginBottom: 10
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: '#DC2626'
  },
  progressStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%'
  },
  statusText: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '600'
  },
  percentText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800'
  }
});
