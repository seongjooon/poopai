import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState } from 'react';
import { View, StyleSheet, Platform, Alert, Image } from 'react-native';
import { Typography, Button } from '@src/ui/atoms';
import { useAuth } from '@src/core/auth';
import { useTheme, type ThemePalette } from '@config/theme';

interface LoginScreenProps {
  onComplete: () => void;
}

export const LoginScreen = ({ onComplete }: LoginScreenProps) => {
  const { theme, isDark } = useTheme();
  const { signInWithApple, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const styles = React.useMemo(() => createStyles(theme, isDark), [theme, isDark]);

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
          <View style={styles.logoShell}>
            <Image
              source={require('../../../assets/icon.png')}
              style={styles.logoImage}
              resizeMode="cover"
            />
          </View>
          <Typography variant="h1" style={styles.title}>
            PoopAI
          </Typography>
        </View>

        {/* Sign in */}
        <View style={styles.bottom}>
          {Platform.OS === 'ios' && (
            <Button
              title="Continue with Apple"
              onPress={() => handleSignIn(signInWithApple)}
              loading={isLoading}
              textColor={theme.background}
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

          <Typography variant="caption" color={theme.tertiaryLabel} style={styles.legal}>
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Typography>
        </View>
      </View>
    </SafeAreaView>
  );
};

function createStyles(theme: ThemePalette, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
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
      gap: 18,
    },
    logoShell: {
      width: 150,
      height: 150,
      borderRadius: 34,
      overflow: 'hidden',
      backgroundColor: theme.elevatedBackground,
      shadowColor: '#000000',
      shadowOpacity: isDark ? 0.45 : 0.14,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 10 },
      elevation: 10,
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      color: theme.label,
      fontSize: 42,
      fontWeight: '700',
      letterSpacing: -0.8,
    },
    bottom: {
      gap: 16,
    },
    appleButton: {
      backgroundColor: theme.label,
      borderColor: isDark ? theme.separator : 'transparent',
      borderWidth: isDark ? 1 : 0,
      borderRadius: 14,
      paddingVertical: 18,
    },
    legal: {
      textAlign: 'center',
      lineHeight: 16,
      paddingHorizontal: 20,
    },
  });
}
