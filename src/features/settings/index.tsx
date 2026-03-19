import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { Typography } from '@src/ui/atoms';
import {
  SettingsItem,
  SettingsSection,
  VersionInfo,
} from './components';
import { useSettings } from './useSettings';
import { spacing, useTheme, type ThemeMode } from '@config/theme';

interface SettingsScreenProps {
  onClose?: () => void;
}

export const SettingsScreen = ({ onClose }: SettingsScreenProps) => {
  const { theme, themeMode, setThemeMode } = useTheme();
  const {
    user,
    isPro,
    handleSignIn,
    handleSignOut,
    handleDeleteAccount,
    handleRestorePurchases,
    openURL,
    sendEmail,
    handleResetOnboarding,
  } = useSettings();

  const APP_VERSION = '1.0.0';
  const BUILD_NUMBER = '1';
  const themeOptions: Array<{ label: string; value: ThemeMode }> = [
    { label: 'System', value: 'system' },
    { label: 'Light', value: 'light' },
    { label: 'Dark', value: 'dark' },
  ];

  const handleThemeChange = async (mode: ThemeMode) => {
    await setThemeMode(mode);
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.secondaryBackground,
    },
    header: {
      paddingHorizontal: spacing.l,
      paddingTop: spacing.m,
      paddingBottom: spacing.m,
      backgroundColor: theme.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator,
    },
    handleBar: {
      width: 36,
      height: 5,
      borderRadius: 3,
      backgroundColor: theme.tertiaryLabel,
      alignSelf: 'center',
      marginBottom: 12,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    title: {
      marginBottom: 0,
      fontSize: 28,
      color: theme.label,
    },
    doneButton: {
      paddingVertical: spacing.s,
      paddingHorizontal: 4,
    },
    doneText: {
      fontSize: 17,
      fontWeight: '600',
    },
    proPromoBanner: {
      backgroundColor: theme.primary,
      marginHorizontal: spacing.l,
      marginVertical: spacing.l,
      paddingVertical: spacing.m,
      paddingHorizontal: spacing.l,
      borderRadius: 12,
      alignItems: 'center',
    },
    proPromoText: {
      fontWeight: '600',
    },
    disclaimerContainer: {
      marginHorizontal: spacing.l,
      marginTop: spacing.m,
      marginBottom: spacing.s,
    },
    disclaimerText: {
      textAlign: 'center',
      fontSize: 11,
      lineHeight: 15,
    },
    lastItem: {
      borderBottomWidth: 0,
    },
    themeOption: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: spacing.m,
      backgroundColor: theme.background,
      borderBottomWidth: StyleSheet.hairlineWidth,
      borderBottomColor: theme.separator,
    },
    themeOptionSelected: {
      backgroundColor: theme.accentBackground,
    },
    themeOptionLast: {
      borderBottomWidth: 0,
    },
    themeOptionText: {
      fontSize: 17,
      color: theme.label,
    },
    checkmark: {
      fontSize: 17,
      color: theme.systemBlue,
      fontWeight: '600',
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          {onClose && (
            <View style={styles.handleBar} />
          )}
          <View style={styles.headerRow}>
            <Typography variant="h1" style={styles.title}>
              Settings
            </Typography>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.doneButton}>
                <Typography color={theme.primary} style={styles.doneText}>Done</Typography>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Pro Status Section */}
        {!isPro && (
          <View style={styles.proPromoBanner}>
            <Typography
              variant="body"
              color={theme.onPrimary}
              style={styles.proPromoText}
            >
              Upgrade to Pro for unlimited access
            </Typography>
          </View>
        )}

        {/* Appearance Section */}
        <SettingsSection title="Appearance">
          {themeOptions.map((option, index) => {
            const isSelected = themeMode === option.value;
            const isLast = index === themeOptions.length - 1;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  isSelected && styles.themeOptionSelected,
                  isLast && styles.themeOptionLast,
                ]}
                onPress={() => {
                  void handleThemeChange(option.value);
                }}
              >
                <Typography style={styles.themeOptionText}>{option.label}</Typography>
                {isSelected && <Typography style={styles.checkmark}>✓</Typography>}
              </TouchableOpacity>
            );
          })}
        </SettingsSection>

        {/* Account Section */}
        <SettingsSection title="Account">
          {/* User ID / Status */}
          <SettingsItem
            label="Account ID"
            value={user?.id || 'No account'}
            onPress={() => {
              Alert.alert('Account ID', user?.id || 'You are not logged in');
            }}
          />

          {/* Login Status */}
          {user?.isAnonymous ? (
            <SettingsItem
              label="Sign in with Apple"
              value="Save your progress"
              onPress={handleSignIn}
            />
          ) : (
            <>
              <SettingsItem
                label="Email"
                value={user?.email || 'Not available'}
                onPress={() => {
                  Alert.alert(
                    'Email',
                    user?.email || 'Email not available'
                  );
                }}
              />

              <SettingsItem
                label="Sign Out"
                onPress={handleSignOut}
                style={styles.lastItem}
              />
            </>
          )}
        </SettingsSection>

        {/* Delete Account Section (Only for logged-in users) */}
        {user && !user.isAnonymous && (
          <SettingsSection title="Danger Zone">
            <SettingsItem
              label="Delete Account"
              value="Permanent action"
              onPress={handleDeleteAccount}
              isDangerous
              style={styles.lastItem}
            />
          </SettingsSection>
        )}

        {/* Support Section */}
        <SettingsSection title="Support & Legal">
          <SettingsItem
            label="Contact Support"
            value="Email us"
            onPress={sendEmail}
          />

          <SettingsItem
            label="Restore Purchases"
            value="Recover subscriptions"
            onPress={handleRestorePurchases}
          />

          <SettingsItem
            label="Privacy Policy"
            onPress={() => openURL('https://seongjooon.github.io/poopai/privacy/')}
          />

          <SettingsItem
            label="Terms of Service"
            onPress={() => openURL('https://seongjooon.github.io/poopai/terms/')}
            style={styles.lastItem}
          />
        </SettingsSection>



        {/* Health Disclaimer */}
        <View style={styles.disclaimerContainer}>
          <Typography variant="caption" color={theme.tertiaryLabel} style={styles.disclaimerText}>
            Poop AI is for informational and educational purposes only. It is not intended as medical advice, diagnosis, or treatment. Always consult a qualified healthcare professional for any health concerns.
          </Typography>
        </View>

        {/* Version Info Footer */}
        <VersionInfo version={APP_VERSION} buildNumber={BUILD_NUMBER} />
      </ScrollView>
    </SafeAreaView>
  );
};
