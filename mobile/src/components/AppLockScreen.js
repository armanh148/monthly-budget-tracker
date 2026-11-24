import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  StatusBar,
  ActivityIndicator
} from 'react-native';
import Ionicons from './Icon';
import { securityService } from '../services/security';

const USE_NATIVE_DRIVER = Platform.OS !== 'web';

export default function AppLockScreen({
  mode = 'unlock', // 'unlock' | 'setup'
  userKey,
  userEmail,
  biometricEnabled = false,
  biometricSupported = false,
  onUnlock,
  onCancel,
  onUseEmailLogin
}) {
  const [pin, setPin] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [step, setStep] = useState('enter'); // 'enter' | 'confirm' | 'faceid_offer'
  const [errorMsg, setErrorMsg] = useState('');
  const [bioBusy, setBioBusy] = useState(false);

  const shakeAnim = useRef(new Animated.Value(0)).current;

  const triggerShake = (msg) => {
    setErrorMsg(msg);
    setPin('');
    Animated.sequence([
      Animated.timing(shakeAnim, { toValue: 12, duration: 55, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(shakeAnim, {
        toValue: -12,
        duration: 55,
        useNativeDriver: USE_NATIVE_DRIVER
      }),
      Animated.timing(shakeAnim, { toValue: 8, duration: 50, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(shakeAnim, { toValue: -8, duration: 50, useNativeDriver: USE_NATIVE_DRIVER }),
      Animated.timing(shakeAnim, { toValue: 0, duration: 50, useNativeDriver: USE_NATIVE_DRIVER })
    ]).start();
  };

  const handleBiometric = async () => {
    if (bioBusy || mode !== 'unlock' || !biometricEnabled || !userKey) return;
    setBioBusy(true);
    setErrorMsg('');
    try {
      const res = await securityService.authenticateBiometric(userKey);
      if (res.ok) {
        if (onUnlock) onUnlock();
      } else if (res.error) {
        setErrorMsg(res.error);
      }
    } finally {
      setBioBusy(false);
    }
  };

  const handleBiometricRef = useRef(handleBiometric);
  handleBiometricRef.current = handleBiometric;

  // Auto-prompt Face ID when opening locked vault
  useEffect(() => {
    if (mode === 'unlock' && biometricEnabled && userKey) {
      const t = setTimeout(() => {
        handleBiometricRef.current();
      }, 350);
      return () => clearTimeout(t);
    }
  }, [mode, biometricEnabled, userKey]);

  const handleEnableFaceIdAfterPin = async () => {
    setBioBusy(true);
    setErrorMsg('');
    try {
      await securityService.registerBiometric(userKey, userEmail || userKey);
      if (onUnlock) onUnlock();
    } catch (err) {
      setErrorMsg(err?.message || 'Face ID cancelled. You can enable it anytime in Settings.');
    } finally {
      setBioBusy(false);
    }
  };

  const handleDigit = async (digit) => {
    if (pin.length >= 4) return;
    setErrorMsg('');
    const next = pin + digit;
    setPin(next);

    if (next.length === 4) {
      if (mode === 'unlock') {
        const valid = await securityService.verifyPin(userKey, next);
        if (valid) {
          if (onUnlock) onUnlock();
        } else {
          triggerShake('Incorrect PIN. Try again or use Email Login.');
        }
      } else if (mode === 'setup') {
        if (step === 'enter') {
          setFirstPin(next);
          setPin('');
          setStep('confirm');
        } else {
          if (next === firstPin) {
            await securityService.setPin(userKey, next);
            if (biometricSupported) {
              setStep('faceid_offer');
              setPin('');
            } else if (onUnlock) {
              onUnlock();
            }
          } else {
            setFirstPin('');
            setStep('enter');
            triggerShake('PINs did not match. Start again.');
          }
        }
      }
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setErrorMsg('');
    }
  };

  // Step 3 (Setup Mode): Optional 1-Tap Face ID activation right after setting PIN
  if (mode === 'setup' && step === 'faceid_offer') {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor="#0D1117" />
        <View style={styles.orbTop} />
        <View style={styles.orbBottom} />

        <View style={styles.faceOfferCard}>
          <View
            style={[styles.lockCoin, { backgroundColor: '#45CF87', borderBottomColor: '#24A462' }]}
          >
            <Ionicons name="scan-outline" size={38} color="#FFFFFF" />
          </View>

          <Text style={styles.title}>4-Digit PIN Saved!</Text>
          <Text style={styles.subtitle}>
            Enable Face ID / Touch ID on this iPhone for instant unlock? You can change this anytime
            in Settings.
          </Text>

          {errorMsg.length > 0 && (
            <View style={[styles.errorPill, { marginTop: 14 }]}>
              <Ionicons name="alert-circle" size={14} color="#FFE4E6" />
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          )}

          <View style={styles.offerButtons}>
            <TouchableOpacity
              style={styles.offerPrimaryBtn}
              onPress={handleEnableFaceIdAfterPin}
              disabled={bioBusy}
              activeOpacity={0.85}
            >
              {bioBusy ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <>
                  <Ionicons name="scan-outline" size={20} color="#FFFFFF" />
                  <Text style={styles.offerPrimaryText}>Enable Face ID / Touch ID</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.offerSecondaryBtn}
              onPress={onUnlock}
              disabled={bioBusy}
              activeOpacity={0.8}
            >
              <Text style={styles.offerSecondaryText}>Done (Use PIN Only)</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  const titleText =
    mode === 'setup'
      ? step === 'enter'
        ? 'Create 4-Digit PIN'
        : 'Confirm Your PIN'
      : 'Budget Vault Locked';

  const subtitleText =
    mode === 'setup'
      ? step === 'enter'
        ? 'Choose a 4-digit passcode for your account'
        : 'Re-enter the same 4-digit PIN to confirm'
      : biometricEnabled
        ? 'Unlock with Face ID or enter your 4-digit PIN'
        : 'Enter your 4-digit PIN to continue';

  const keypadRows = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9']
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#130E0B" />

      {/* Decorative Clay Glows */}
      <View style={styles.orbTop} />
      <View style={styles.orbBottom} />

      {/* Optional Cancel for Setup Mode */}
      {mode === 'setup' && onCancel && (
        <TouchableOpacity style={styles.cancelTopBtn} onPress={onCancel} activeOpacity={0.8}>
          <Ionicons name="close" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      )}

      {/* Puffy 3D Shield Emblem */}
      <View style={styles.headerBlock}>
        <View style={styles.lockCoin}>
          <Ionicons
            name={mode === 'setup' ? 'shield-checkmark' : 'lock-closed'}
            size={34}
            color="#FFFFFF"
          />
        </View>
        <Text style={styles.title}>{titleText}</Text>
        {userEmail ? (
          <View style={styles.userEmailBadge}>
            <Text style={styles.userEmailText}>{userEmail}</Text>
          </View>
        ) : null}
        <Text style={styles.subtitle}>{subtitleText}</Text>
      </View>

      {/* 4 Puffy PIN Dots */}
      <Animated.View style={[styles.dotsRow, { transform: [{ translateX: shakeAnim }] }]}>
        {[0, 1, 2, 3].map((idx) => {
          const filled = idx < pin.length;
          return (
            <View
              key={idx}
              style={[
                styles.pinDot,
                filled && styles.pinDotFilled,
                errorMsg.length > 0 && styles.pinDotError
              ]}
            />
          );
        })}
      </Animated.View>

      {/* Feedback / Error Pill */}
      <View style={styles.feedbackSlot}>
        {errorMsg.length > 0 && (
          <View style={styles.errorPill}>
            <Ionicons name="alert-circle" size={14} color="#FFE4E6" />
            <Text style={styles.errorText}>{errorMsg}</Text>
          </View>
        )}
      </View>

      {/* 3D Puffy Clay Keypad */}
      <View style={styles.keypadWrap}>
        {keypadRows.map((row, rIdx) => (
          <View key={rIdx} style={styles.keypadRow}>
            {row.map((num) => (
              <TouchableOpacity
                key={num}
                style={styles.keyBtn}
                onPress={() => handleDigit(num)}
                activeOpacity={0.75}
                accessibilityLabel={`Digit ${num}`}
              >
                <Text style={styles.keyText}>{num}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Bottom Row: Face ID | 0 | Backspace */}
        <View style={styles.keypadRow}>
          {mode === 'unlock' && biometricEnabled ? (
            <TouchableOpacity
              style={[styles.keyBtn, styles.bioKeyBtn]}
              onPress={handleBiometric}
              activeOpacity={0.75}
              disabled={bioBusy}
              accessibilityLabel="Unlock with Face ID"
            >
              <Ionicons name="scan-outline" size={24} color="#FFFFFF" />
              <Text style={styles.bioKeyLabel}>Face ID</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.keyPlaceholder} />
          )}

          <TouchableOpacity
            style={styles.keyBtn}
            onPress={() => handleDigit('0')}
            activeOpacity={0.75}
            accessibilityLabel="Digit 0"
          >
            <Text style={styles.keyText}>0</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.keyBtn, styles.backKeyBtn]}
            onPress={handleBackspace}
            activeOpacity={0.75}
            accessibilityLabel="Delete digit"
          >
            <Ionicons name="backspace-outline" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Fallback: Use Email Login / Switch Account */}
      {mode === 'unlock' && onUseEmailLogin && (
        <TouchableOpacity
          style={styles.emailFallbackBtn}
          onPress={onUseEmailLogin}
          activeOpacity={0.8}
        >
          <Ionicons name="mail-outline" size={15} color="#FFFFFF" />
          <Text style={styles.emailFallbackText}>Use Email Login / Switch Account</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#130E0B',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 999998
  },
  orbTop: {
    position: 'absolute',
    top: -90,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(231, 168, 161, 0.12)'
  },
  orbBottom: {
    position: 'absolute',
    bottom: -80,
    left: -70,
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: 'rgba(226, 141, 147, 0.12)'
  },
  cancelTopBtn: {
    position: 'absolute',
    top: 24,
    right: 22,
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderTopWidth: 1.5,
    borderBottomWidth: 3,
    borderTopColor: 'rgba(255,255,255,0.2)',
    borderBottomColor: '#0A0604',
    alignItems: 'center',
    justifyContent: 'center'
  },
  headerBlock: {
    alignItems: 'center',
    marginBottom: 18
  },
  lockCoin: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: '#0A192F',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    shadowColor: '#0A192F',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: -0.4,
    textAlign: 'center'
  },
  userEmailBadge: {
    marginTop: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.18)'
  },
  userEmailText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700'
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.84)',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center'
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 18,
    marginBottom: 10
  },
  pinDot: {
    width: 17,
    height: 17,
    borderRadius: 8.5,
    borderWidth: 2.5,
    borderColor: 'rgba(255, 255, 255, 0.55)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  pinDotFilled: {
    backgroundColor: '#E7A8A1',
    borderColor: '#FEFFFE',
    shadowColor: '#E28D93',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 8,
    elevation: 4
  },
  pinDotError: {
    borderColor: '#FCA5A5'
  },
  feedbackSlot: {
    minHeight: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10
  },
  errorPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: 'rgba(225, 29, 72, 0.32)',
    borderWidth: 1,
    borderColor: 'rgba(254, 205, 211, 0.5)'
  },
  errorText: {
    color: '#FFE4E6',
    fontSize: 11,
    fontWeight: '700'
  },
  keypadWrap: {
    width: '100%',
    maxWidth: 288,
    gap: 12
  },
  keypadRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 14
  },
  keyBtn: {
    flex: 1,
    height: 60,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 227, 179, 0.18)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3
  },
  keyPlaceholder: {
    flex: 1,
    height: 60
  },
  bioKeyBtn: {
    backgroundColor: 'rgba(30, 58, 138, 0.35)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  bioKeyLabel: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    marginTop: 2
  },
  backKeyBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.14)'
  },
  keyText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800'
  },
  emailFallbackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 22,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  emailFallbackText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800'
  },
  faceOfferCard: {
    width: '100%',
    maxWidth: 340,
    alignItems: 'center',
    padding: 24,
    borderRadius: 28,
    backgroundColor: 'rgba(255, 255, 255, 0.14)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)'
  },
  offerButtons: {
    width: '100%',
    gap: 10,
    marginTop: 22
  },
  offerPrimaryBtn: {
    width: '100%',
    height: 50,
    borderRadius: 16,
    backgroundColor: '#0A192F',
    borderTopWidth: 2,
    borderBottomWidth: 4.5,
    borderTopColor: '#2563EB',
    borderBottomColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8
  },
  offerPrimaryText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  offerSecondaryBtn: {
    width: '100%',
    height: 44,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  offerSecondaryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700'
  }
});
