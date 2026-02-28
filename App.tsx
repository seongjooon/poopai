import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from './src/features/onboarding';
import { LoginScreen } from './src/features/login';
import { PaywallScreen } from './src/features/paywall';
import { SettingsScreen } from './src/features/settings';
import { useAuth } from './src/core/auth';
import { usePayments, configurePayments } from './src/core/payments';
import { Analytics } from './src/core/analytics';
import { ErrorBoundary } from './src/core/error/ErrorBoundary';

type AppState = 'loading' | 'onboarding' | 'login' | 'paywall' | 'main' | 'settings';

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [appState, setAppState] = useState<AppState>('loading');
  const user = useAuth((s) => s.user);
  const isAuthInitialized = useAuth((s) => s.isInitialized);
  const isPro = usePayments((s) => s.isPro);

  useEffect(() => {
    // Initialize core services
    useAuth.getState().initialize();
    configurePayments();
    Analytics.initialize();
  }, []);

  // Main routing logic — runs when auth/payment state changes
  useEffect(() => {
    if (!isAuthInitialized) return;

    const resolveAppState = async () => {
      // 1. Not logged in → check onboarding
      if (!user) {
        const onboardingDone = await AsyncStorage.getItem('onboarding_completed');
        setAppState(onboardingDone ? 'login' : 'onboarding');
        return;
      }

      // 2. Logged in but not Pro → paywall (hard gate)
      if (!isPro) {
        // Initialize payments to check subscription status
        await usePayments.getState().initialize();
        const currentIsPro = usePayments.getState().isPro;
        if (!currentIsPro) {
          setAppState('paywall');
          return;
        }
      }

      // 3. Logged in + Pro → main
      setAppState('main');
    };

    resolveAppState();
  }, [user, isPro, isAuthInitialized]);

  const handleOnboardingComplete = () => {
    setAppState('login');
  };

  const handleLoginComplete = async () => {
    // After login, check pro status
    await usePayments.getState().initialize();
    const currentIsPro = usePayments.getState().isPro;
    setAppState(currentIsPro ? 'main' : 'paywall');
  };

  const handlePaywallComplete = () => {
    setAppState('main');
  };

  const handleNavigateToSettings = () => {
    setAppState('settings');
  };

  const handleCloseSettings = () => {
    setAppState('main');
  };

  if (appState === 'loading') {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
        <StatusBar style="auto" />
      </View>
    );
  }

  if (appState === 'onboarding') {
    return (
      <>
        <OnboardingScreen
          onNavigateToPaywall={handleOnboardingComplete}
          onNavigateToMain={handleOnboardingComplete}
        />
        <StatusBar style="auto" />
      </>
    );
  }

  if (appState === 'login') {
    return (
      <>
        <LoginScreen onComplete={handleLoginComplete} />
        <StatusBar style="auto" />
      </>
    );
  }

  if (appState === 'paywall') {
    return (
      <>
        <PaywallScreen onClose={handlePaywallComplete} isHardPaywall={true} />
        <StatusBar style="auto" />
      </>
    );
  }

  if (appState === 'settings') {
    return (
      <>
        <SettingsScreen onClose={handleCloseSettings} />
        <StatusBar style="auto" />
      </>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>PoopAI</Text>
      <Text style={styles.subtitle}>Your gut health companion 💩</Text>

      <TouchableOpacity
        onPress={handleNavigateToSettings}
        style={styles.settingsButton}
      >
        <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
      </TouchableOpacity>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
  },
  settingsButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  settingsButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
