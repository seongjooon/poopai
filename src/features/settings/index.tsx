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
import { colors, spacing } from '@config/theme';

interface SettingsScreenProps {
  onClose?: () => void;
}

export const SettingsScreen = ({ onClose }: SettingsScreenProps) => {
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            {onClose && (
              <TouchableOpacity onPress={onClose} style={styles.backButton}>
                <Typography color={colors.primary}>← Back</Typography>
              </TouchableOpacity>
            )}
            <Typography variant="h1" style={styles.title}>
              Settings
            </Typography>
          </View>
        </View>

        {/* Pro Status Section */}
        {!isPro && (
          <View style={styles.proPromoBanner}>
            <Typography
              variant="body"
              color="#FFFFFF"
              style={styles.proPromoText}
            >
              Upgrade to Pro for unlimited access
            </Typography>
          </View>
        )}

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
            onPress={() => openURL('https://example.com/privacy-policy')}
          />

          <SettingsItem
            label="Terms of Service"
            onPress={() => openURL('https://example.com/terms-of-service')}
            style={styles.lastItem}
          />
        </SettingsSection>

        {/* Developer Section */}
        <SettingsSection title="Developer">
          <SettingsItem
            label="Reset Onboarding"
            value="Show onboarding + first scan intro again"
            onPress={handleResetOnboarding}
            style={styles.lastItem}
          />
        </SettingsSection>

        {/* Version Info Footer */}
        <VersionInfo version={APP_VERSION} buildNumber={BUILD_NUMBER} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9F9F9',
  },
  header: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.l,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: spacing.m,
    paddingVertical: spacing.s,
  },
  title: {
    marginBottom: spacing.s,
  },
  proPromoBanner: {
    backgroundColor: colors.primary,
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
  lastItem: {
    borderBottomWidth: 0,
  },
});
