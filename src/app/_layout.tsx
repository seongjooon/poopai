import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../core/auth';
import { usePayments, configurePayments } from '../core/payments';
import { Analytics } from '../core/analytics';
import Constants from 'expo-constants';

// In Expo Go, RevenueCat native store is unavailable — skip paywall gate
const isExpoGo = Constants.appOwnership === 'expo';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const user = useAuth((s) => s.user);
  const isAuthInitialized = useAuth((s) => s.isInitialized);
  const isPro = usePayments((s) => s.isPro);
  const [isReady, setIsReady] = useState(false);
  const [onboardingDone, setOnboardingDone] = useState(false);

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

  // Route guard
  useEffect(() => {
    if (!isReady || !isAuthInitialized) return;

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
  }, [isReady, isAuthInitialized, user, isPro, onboardingDone, segments]);

  return (
    <>
      <StatusBar style="auto" />
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
