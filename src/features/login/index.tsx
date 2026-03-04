import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import {
  View,
  StyleSheet,

  Platform,
  Alert,
} from 'react-native';
import { Typography, Button } from '@src/ui/atoms';
import { useAuth } from '@src/core/auth';
import { colors, spacing } from '@config/theme';

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
        <View style={styles.header}>
          <Typography variant="h1" style={styles.title}>
            Welcome
          </Typography>
          <Typography variant="body" color="#8E8E93">
            Sign in to get started
          </Typography>
        </View>

        <View style={styles.buttons}>
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
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
  },
  header: {
    alignItems: 'center',
    marginBottom: spacing.xl,
  },
  title: {
    marginBottom: spacing.s,
  },
  buttons: {
    gap: spacing.m,
  },
  appleButton: {
    backgroundColor: '#000000',
  },
});
