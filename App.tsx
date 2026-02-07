import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from './src/features/onboarding';
import { LoginScreen } from './src/features/login';
import { PaywallScreen } from './src/features/paywall';
import { SettingsScreen } from './src/features/settings';
import { useAuth } from './src/core/auth';
import { configurePayments } from './src/core/payments';
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

  useEffect(() => {
    // Initialize core services
    useAuth.getState().initialize();
    configurePayments();
    Analytics.initialize();

    const checkOnboardingStatus = async () => {
      try {
        const isCompleted = await AsyncStorage.getItem('onboarding_completed');
        setAppState(isCompleted ? 'main' : 'onboarding');
      } catch (error) {
        console.error('Error checking onboarding status:', error);
        setAppState('onboarding');
      }
    };

    checkOnboardingStatus();
  }, []);

  const handleNavigateToLogin = () => {
    setAppState('login');
  };

  const handleNavigateToPaywall = () => {
    setAppState('paywall');
  };

  const handleNavigateToMain = () => {
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
          onNavigateToPaywall={handleNavigateToLogin}
          onNavigateToMain={handleNavigateToLogin}
        />
        <StatusBar style="auto" />
      </>
    );
  }

  if (appState === 'login') {
    return (
      <>
        <LoginScreen onComplete={handleNavigateToPaywall} />
        <StatusBar style="auto" />
      </>
    );
  }

  if (appState === 'paywall') {
    return (
      <>
        <PaywallScreen onClose={handleNavigateToMain} />
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
      <Text style={styles.mainTitle}>Main App Screen</Text>
      <Text style={styles.subtitle}>Onboarding completed! 🎉</Text>

      <TouchableOpacity
        onPress={handleNavigateToSettings}
        style={styles.settingsButton}
      >
        <Text style={styles.settingsButtonText}>⚙️ Settings</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleNavigateToPaywall}
        style={styles.paywallButton}
      >
        <Text style={styles.paywallButtonText}>💳 View Paywall</Text>
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
  paywallButton: {
    backgroundColor: '#34C759',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    alignItems: 'center',
  },
  paywallButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
