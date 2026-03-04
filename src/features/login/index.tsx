import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, StyleSheet, Platform, Alert } from 'react-native';
import { Typography, Button } from '@src/ui/atoms';
import { useAuth } from '@src/core/auth';

interface LoginScreenProps {
  onComplete: () => void;
}

export const LoginScreen = ({ onComplete }: LoginScreenProps) => {
  const { signInWithApple, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (method: () => Promise<void>) => {
    setIsLoading(true);
    try {
      await method();
      onComplete();
    } catch (error: any) {
      if (error?.code !== 'ERR_CANCELED') {
        Alert.alert(
          'Sign In Error',
          error?.message || 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* Hero */}
        <View style={styles.hero}>
          <Typography style={styles.icon}>💩</Typography>
          <Typography variant="h1" style={styles.title}>
            PoopAI
          </Typography>
          <Typography variant="body" color="#8E8E93" style={styles.subtitle}>
            Your gut health companion
          </Typography>
        </View>

        {/* Sign in */}
        <View style={styles.bottom}>
          {Platform.OS === 'ios' && (
            <Button
              title="Continue with Apple"
              onPress={() => handleSignIn(signInWithApple)}
              loading={isLoading}
              style={styles.appleButton}
            />
          )}

          {Platform.OS === 'android' && (
            <Button
              title="Continue with Google"
              onPress={() => handleSignIn(signInWithGoogle)}
              loading={isLoading}
            />
          )}

          <Typography variant="caption" color="#C7C7CC" style={styles.legal}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  hero: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 72,
    marginBottom: 16,
  },
  title: {
    color: '#000000',
    fontSize: 34,
    fontWeight: '700',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 17,
    lineHeight: 22,
  },
  bottom: {
    gap: 16,
  },
  appleButton: {
    backgroundColor: '#000000',
    borderRadius: 14,
    paddingVertical: 18,
  },
  legal: {
    textAlign: 'center',
    lineHeight: 16,
    paddingHorizontal: 20,
  },
});
