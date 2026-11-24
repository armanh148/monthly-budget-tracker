import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native';
import Ionicons from '../components/Icon';
import { useAuth } from '../context/AuthContext';
import { palette } from '../theme/colors';
import ServerConfigModal from '../components/ServerConfigModal';

export default function AuthScreen() {
  const { login, register, themeMode, toggleTheme } = useAuth();
  const colors = palette[themeMode] || palette.light;

  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showServerConfig, setShowServerConfig] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg('');
    if (!email.trim() || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (isRegister && (!name.trim() || name.trim().length < 2)) {
      setErrorMsg('Please enter your full name (minimum 2 characters).');
      return;
    }

    setIsLoading(true);
    try {
      if (isRegister) {
        await register(name.trim(), email.trim(), password);
      } else {
        await login(email.trim(), password);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@budgettracker.com');
    setPassword('password123');
    if (isRegister) setName('Demo User');
    setErrorMsg('');
  };

  const isDark = themeMode === 'dark';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Top Action Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={[
              styles.frostedTopBtn,
              { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={toggleTheme}
            accessibilityLabel="Toggle Theme"
          >
            <Ionicons name={isDark ? 'sunny-outline' : 'moon-outline'} size={18} color="#FFFFFF" />
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.frostedTopBtn,
              { backgroundColor: colors.primary, borderColor: colors.primary }
            ]}
            onPress={() => setShowServerConfig(true)}
            accessibilityLabel="Server Settings"
          >
            <Ionicons name="server-outline" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Brand Header */}
        <View style={styles.heroSection}>
          <View style={[styles.brandIconCircle, { backgroundColor: colors.primary }]}>
            <Ionicons name="wallet" size={32} color="#FFFFFF" />
          </View>
          <Text style={[styles.heroTitle, { color: colors.text }]}>Budget Tracker</Text>
          <Text style={[styles.heroSubtitle, { color: colors.textSecondary }]}>
            Smart Monthly Financial Management
          </Text>
        </View>

        {/* Executive Sunset Card */}
        <View
          style={[
            styles.authCard,
            {
              backgroundColor: isDark ? colors.surface : '#FFFFFF',
              borderColor: colors.border,
              shadowColor: colors.shadow,
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: isDark ? 0.45 : 0.08,
              shadowRadius: 16,
              elevation: 4
            }
          ]}
        >
          {/* Segmented Switch */}
          <View
            style={[
              styles.tabsWrap,
              { backgroundColor: isDark ? 'rgba(0, 0, 0, 0.25)' : colors.surfaceSubtle }
            ]}
          >
            <TouchableOpacity
              style={[
                styles.tabBtn,
                !isRegister && [styles.tabBtnActive, { backgroundColor: colors.primary }]
              ]}
              onPress={() => {
                setIsRegister(false);
                setErrorMsg('');
              }}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: !isRegister ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: !isRegister ? '800' : '600'
                  }
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tabBtn,
                isRegister && [styles.tabBtnActive, { backgroundColor: colors.primary }]
              ]}
              onPress={() => {
                setIsRegister(true);
                setErrorMsg('');
              }}
            >
              <Text
                style={[
                  styles.tabBtnText,
                  {
                    color: isRegister ? '#FFFFFF' : colors.textSecondary,
                    fontWeight: isRegister ? '800' : '600'
                  }
                ]}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form Area */}
          <View style={styles.formArea}>
            {isRegister && (
              <View style={styles.inputGroup}>
                <Text style={[styles.label, { color: colors.text }]}>
                  FULL NAME
                </Text>
                <View
                  style={[
                    styles.inputField,
                    {
                      backgroundColor: colors.surfaceSubtle,
                      borderColor: colors.border
                    }
                  ]}
                >
                  <Ionicons
                    name="person-outline"
                    size={17}
                    color={colors.textTertiary}
                    style={styles.fieldIcon}
                  />
                  <TextInput
                    style={[styles.input, { color: colors.text }]}
                    placeholder="e.g. John Doe"
                    placeholderTextColor={colors.textTertiary}
                    value={name}
                    onChangeText={setName}
                    autoCapitalize="words"
                  />
                </View>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                EMAIL ADDRESS
              </Text>
              <View
                style={[
                  styles.inputField,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border
                  }
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={17}
                  color={colors.textTertiary}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="name@example.com"
                  placeholderTextColor={colors.textTertiary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.label, { color: colors.text }]}>
                PASSWORD
              </Text>
              <View
                style={[
                  styles.inputField,
                  {
                    backgroundColor: colors.surfaceSubtle,
                    borderColor: colors.border
                  }
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={17}
                  color={colors.textTertiary}
                  style={styles.fieldIcon}
                />
                <TextInput
                  style={[styles.input, { color: colors.text }]}
                  placeholder="••••••••"
                  placeholderTextColor={colors.textTertiary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeBtn}
                >
                  <Ionicons
                    name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                    size={17}
                    color={colors.textTertiary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {errorMsg.length > 0 && (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle" size={15} color="#E11D48" />
                <Text style={styles.errorMsgText}>{errorMsg}</Text>
              </View>
            )}

            {/* Primary Action Button */}
            <TouchableOpacity
              style={[styles.submitButton, { backgroundColor: colors.primary }]}
              onPress={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={[styles.submitButtonText, { color: '#FFFFFF' }]}>
                  {isRegister ? 'Create Account' : 'Sign In'}
                </Text>
              )}
            </TouchableOpacity>

            {/* Multi-User Security Note */}
            <View
              style={[
                styles.demoFillBtn,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.22)' : colors.surfaceSubtle,
                  borderColor: colors.border
                }
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={14}
                color={colors.primary}
              />
              <Text
                style={[styles.demoFillText, { color: colors.textSecondary }]}
              >
                Private per-email vault • Set PIN & Face ID after login
              </Text>
            </View>

            {/* Optional Demo Quick Fill */}
            <TouchableOpacity
              style={[
                styles.demoFillBtn,
                {
                  backgroundColor: isDark ? 'rgba(0, 0, 0, 0.22)' : colors.surfaceSubtle,
                  borderColor: colors.border
                }
              ]}
              onPress={handleFillDemo}
            >
              <Ionicons
                name="flash-outline"
                size={14}
                color={colors.primary}
              />
              <Text
                style={[styles.demoFillText, { color: colors.primaryDark }]}
              >
                Try Demo Account (demo@budgettracker.com)
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footerNote}>
          <Text style={styles.footerText}>Multi-User Cloud Sync • Neon PostgreSQL</Text>
        </View>
      </ScrollView>

      {/* Server Configuration Modal */}
      <ServerConfigModal visible={showServerConfig} onClose={() => setShowServerConfig(false)} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 40,
    alignItems: 'center'
  },
  topBar: {
    width: '100%',
    maxWidth: 400,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginBottom: 16
  },
  frostedTopBtn: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: 'rgba(255, 255, 255, 0.16)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 20
  },
  brandIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.28,
    shadowRadius: 12,
    elevation: 6
  },
  heroTitle: {
    fontSize: 26,
    fontWeight: '900',
    letterSpacing: -0.6,
    color: '#FFFFFF'
  },
  heroSubtitle: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 4,
    color: 'rgba(255, 255, 255, 0.85)'
  },
  authCard: {
    width: '100%',
    maxWidth: 400,
    padding: 22,
    borderRadius: 22,
    borderWidth: 1,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8
  },
  tabsWrap: {
    flexDirection: 'row',
    borderRadius: 14,
    padding: 3,
    marginBottom: 18
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 9,
    alignItems: 'center',
    borderRadius: 11
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2
  },
  tabBtnText: {
    fontSize: 13
  },
  formArea: {
    gap: 14
  },
  inputGroup: {
    gap: 5
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.7
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1
  },
  fieldIcon: {
    marginRight: 8
  },
  input: {
    flex: 1,
    fontSize: 14,
    padding: 0
  },
  eyeBtn: {
    padding: 3
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3'
  },
  errorMsgText: {
    flex: 1,
    fontSize: 11,
    fontWeight: '700',
    color: '#E11D48'
  },
  submitButton: {
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800'
  },
  demoFillBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 11,
    borderWidth: 1
  },
  demoFillText: {
    fontSize: 11,
    fontWeight: '700'
  },
  offlineDemoBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 9,
    borderRadius: 11,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0'
  },
  offlineDemoText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#059669'
  },
  footerNote: {
    marginTop: 22,
    alignItems: 'center'
  },
  footerText: {
    fontSize: 11,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.75)'
  }
});
