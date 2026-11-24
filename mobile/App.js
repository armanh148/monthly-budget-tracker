import React, { Component, useState } from 'react';
import { View, ActivityIndicator, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './src/context/AuthContext';
import { BudgetProvider } from './src/context/BudgetContext';
import { SecurityProvider, useSecurity } from './src/context/SecurityContext';
import AuthScreen from './src/screens/AuthScreen';
import HomeScreen from './src/screens/HomeScreen';
import AnimatedSplashScreen from './src/components/AnimatedSplashScreen';
import AppLockScreen from './src/components/AppLockScreen';
import { palette } from './src/theme/colors';

// Fallback Error Boundary to display runtime errors gracefully
class ErrorBoundary extends Component {
  state = { hasError: false, error: null };

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('App ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Application Error</Text>
          <Text style={styles.errorMessage}>
            {this.state.error?.message || 'Something went wrong rendering the screen.'}
          </Text>
          <TouchableOpacity
            style={styles.retryBtn}
            onPress={() => this.setState({ hasError: false, error: null })}
          >
            <Text style={styles.retryBtnText}>Reload App</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return this.props.children;
  }
}

function RootNavigator() {
  const { user, isAuthenticated, isLoading, themeMode } = useAuth();
  const {
    userKey,
    isLocked,
    isSettingUpPin,
    showSecurityGuide,
    biometricEnabled,
    biometricSupported,
    startPinSetup,
    dismissSecurityGuide,
    unlock,
    finishPinSetup,
    cancelPinSetup,
    switchToEmailLogin
  } = useSecurity();
  const colors = palette[themeMode] || palette.light;

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[styles.loadingText, { color: colors.textSecondary }]}>
          Loading Budget Tracker...
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.rootFill, { backgroundColor: colors.background }]}>
      {isAuthenticated ? (
        <BudgetProvider>
          <HomeScreen />
        </BudgetProvider>
      ) : (
        <AuthScreen />
      )}

      {/* Full-Screen 3D Claymorphism PIN / Face ID Lock Overlay */}
      {isLocked && (
        <AppLockScreen
          mode="unlock"
          userKey={userKey}
          userEmail={user?.email}
          biometricEnabled={biometricEnabled}
          onUnlock={unlock}
          onUseEmailLogin={switchToEmailLogin}
        />
      )}

      {/* Full-Screen 4-Digit PIN + Optional Face ID Setup Flow */}
      {isSettingUpPin && (
        <AppLockScreen
          mode="setup"
          userKey={userKey}
          userEmail={user?.email}
          biometricSupported={biometricSupported}
          onUnlock={finishPinSetup}
          onCancel={cancelPinSetup}
        />
      )}
    </View>
  );
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <View style={{ flex: 1, backgroundColor: '#7A63F1' }}>
        <AnimatedSplashScreen onFinish={() => setShowSplash(false)} />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.rootFill}>
      <ErrorBoundary>
        <AuthProvider>
          <SecurityProvider>
            <RootNavigator />
          </SecurityProvider>
        </AuthProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  rootFill: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20
  },
  loadingText: {
    marginTop: 14,
    fontSize: 13,
    fontWeight: '500'
  },
  errorContainer: {
    flex: 1,
    backgroundColor: '#0B0D14',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24
  },
  errorTitle: {
    color: '#F43F5E',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8
  },
  errorMessage: {
    color: '#94A3B8',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18
  },
  retryBtn: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 10
  },
  retryBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13
  }
});
