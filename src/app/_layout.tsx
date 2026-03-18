import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../core/auth';
import { usePayments, configurePayments } from '../core/payments';
import { Analytics } from '../core/analytics';
import Constants from 'expo-constants';
import { ThemeProvider, useTheme } from '@config/theme';
import { Typography } from '../ui/atoms';

// In Expo Go, RevenueCat native store is unavailable — skip paywall gate
const isExpoGo = Constants.appOwnership === 'expo';


function SplashLoadingScreen() {
  const { theme, isDark } = useTheme();
  return (
    <View style={[splashStyles.container, { backgroundColor: theme.background }]}>
      <View style={[splashStyles.logoShell, { shadowOpacity: isDark ? 0.45 : 0.14 }]}>
        <Image
          source={require('../../assets/icon.png')}
          style={splashStyles.logoImage}
          resizeMode="cover"
        />
      </View>
      <Typography variant="h1" style={[splashStyles.title, { color: theme.label }]}>
        Poop AI
      </Typography>
      <Typography variant="body" color={theme.secondaryLabel}>
        Poop Tracker
      </Typography>
      <ActivityIndicator size="small" color={theme.primary} style={splashStyles.loader} />
    </View>
  );
}

const splashStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logoShell: {
    width: 132, height: 132, borderRadius: 30, overflow: 'hidden',
    shadowColor: '#000', shadowRadius: 16, shadowOffset: { width: 0, height: 8 },
    elevation: 10, marginBottom: 18,
  },
  logoImage: { width: '100%', height: '100%' },
  title: { fontSize: 38, fontWeight: '700', letterSpacing: -0.8 },
  loader: { marginTop: 24 },
});


function RootLayoutContent() {
  const { theme } = useTheme();
  const router = useRouter();
  const segments = useSegments();
  const user = useAuth((s) => s.user);
  const isAuthInitialized = useAuth((s) => s.isInitialized);
  const isPro = usePayments((s) => s.isPro);
  const isPaymentsLoading = usePayments((s) => s.isLoading);
  const [isReady, setIsReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);
  const [paymentsInitialized, setPaymentsInitialized] = useState(false);

  // Initialize core services once
  useEffect(() => {
    useAuth.getState().initialize();
    configurePayments().catch((e) =>
      console.warn('[Layout] configurePayments failed:', e)
    );
    Analytics.initialize();

    AsyncStorage.getItem('onboarding_completed').then((val) => {
      setOnboardingDone(!!val);
      setIsReady(true);
    });
  }, []);

  // Track when payments initialization is done (first time isLoading goes false after auth)
  useEffect(() => {
    if (isAuthInitialized && user && !isPaymentsLoading && !paymentsInitialized) {
      // Give RevenueCat a moment to resolve entitlements
      const timer = setTimeout(() => setPaymentsInitialized(true), 100);
      return () => clearTimeout(timer);
    }
    if (!user && isAuthInitialized) {
      // No user = no need to wait for payments
      setPaymentsInitialized(true);
    }
  }, [isAuthInitialized, user, isPaymentsLoading, paymentsInitialized]);

  // Show splash loading screen until all services are ready
  const allReady = isReady && isAuthInitialized && paymentsInitialized;

  // Route guard
  useEffect(() => {
    if (!allReady) return;

    let isCancelled = false;

    const runGuard = async () => {
      const inOnboarding = segments[0] === 'onboarding';
      const inLogin = segments[0] === 'login';
      const inPaywall = segments[0] === 'paywall';

      // Re-read latest onboarding flag to avoid stale state loops
      const latestOnboardingDone = !!(await AsyncStorage.getItem('onboarding_completed'));
      if (!isCancelled && latestOnboardingDone !== onboardingDone) {
        setOnboardingDone(latestOnboardingDone);
      }

      // 1. Onboarding not done → onboarding
      if (!latestOnboardingDone) {
        if (!inOnboarding) router.replace('/onboarding');
        return;
      }

      // 2. Not logged in → login
      if (!user) {
        if (!inLogin) router.replace('/login');
        return;
      }

      // 3. Not Pro → paywall (skip in Expo Go since RevenueCat doesn't work)
      if (!isPro && !isExpoGo) {
        if (!inPaywall) router.replace('/paywall');
        return;
      }

      // 4. All good → main
      if (inOnboarding || inLogin || inPaywall) {
        router.replace('/');
      }
    };

    runGuard();

    return () => {
      isCancelled = true;
    };
  }, [allReady, user, isPro, onboardingDone, segments]);

  // Show splash loading while initializing
  if (!allReady) {
    return (
      <>
        <StatusBar style={theme.statusBarStyle === 'light-content' ? 'light' : 'dark'} />
        <SplashLoadingScreen />
      </>
    );
  }

  return (
    <>
      <StatusBar style={theme.statusBarStyle === 'light-content' ? 'light' : 'dark'} />
      <Stack screenOptions={{ headerShown: false, animation: 'default' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
        <Stack.Screen name="login" options={{ animation: 'fade' }} />
        <Stack.Screen name="paywall" options={{ presentation: 'modal' }} />
        <Stack.Screen name="scan-intro" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="poop-log" options={{ animation: 'slide_from_bottom', gestureEnabled: false }} />
        <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
      </Stack>
    </>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
