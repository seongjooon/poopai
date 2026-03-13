import { SafeAreaView } from 'react-native-safe-area-context';
import React from 'react';
import {
  View,
  StyleSheet,

  ScrollView,
  Linking,
  TouchableOpacity,
} from 'react-native';
import { Button, Typography } from '@src/ui/atoms';
import { PackageCard, BenefitList } from './components';
import { usePaywall } from './usePaywall';
import { spacing, useTheme, type ThemePalette } from '@config/theme';
import contents from '@config/contents.json';

interface PaywallScreenProps {
  onClose?: () => void;
  /** When true, the close button is hidden (subscription required to proceed) */
  isHardPaywall?: boolean;
}

export const PaywallScreen = ({ onClose, isHardPaywall = false }: PaywallScreenProps) => {
  const { theme } = useTheme();
  const {
    packages,
    selectedPackageId,
    isPurchasing,
    errorMessage,
    trialEligible,
    selectPackage,
    handlePurchase,
    handleRestore,
  } = usePaywall(onClose);
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  const paywallContent = contents.paywall;
  const selectedPackage = packages.find((pkg) => pkg.id === selectedPackageId);
  const trialDays = paywallContent.trialDays ?? 3;

  const openLink = (url: string) => {
    Linking.openURL(url).catch(() => {
      console.error('Failed to open URL:', url);
    });
  };

  // Build CTA text
  const getCtaText = () => {
    if (!selectedPackage) return 'Select a Plan';
    if (trialEligible) {
      return `Start ${trialDays}-Day Free Trial`;
    }
    return `Subscribe to ${selectedPackage.name}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          {/* Close Button — only in soft paywall */}
          {!isHardPaywall && onClose && (
            <TouchableOpacity
              onPress={onClose}
              style={styles.closeButton}
            >
              <Typography color={theme.primary}>✕</Typography>
            </TouchableOpacity>
          )}

          {/* Header Image Placeholder */}
          <View style={styles.headerImage} />

          {/* Title */}
          <Typography variant="h1" style={styles.title}>
            {paywallContent.title}
          </Typography>

          {/* Subtitle */}
          <Typography variant="body" style={styles.subtitle}>
            {paywallContent.subtitle}
          </Typography>

          {/* Trial Badge */}
          {trialEligible && (
            <View style={styles.trialBadge}>
              <Typography variant="body" color={theme.onPrimary} style={styles.trialBadgeText}>
                🎉 {trialDays} days free — cancel anytime
              </Typography>
            </View>
          )}
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsSection}>
          <BenefitList benefits={paywallContent.features} />
        </View>

        {/* Packages Section */}
        <View style={styles.packagesSection}>
          {packages.map((pkg) => (
            <PackageCard
              key={pkg.id}
              package={pkg}
              isSelected={pkg.id === selectedPackageId}
              isLoading={isPurchasing}
              onSelect={(p) => selectPackage(p.id)}
            />
          ))}
        </View>

        {/* Error Message */}
        {errorMessage && (
          <View style={styles.errorContainer}>
            <Typography color={theme.error}>{errorMessage}</Typography>
          </View>
        )}
      </ScrollView>

      {/* Footer - Fixed at bottom */}
      <View style={styles.footer}>
        {/* Subscribe / Trial Button */}
        <Button
          title={getCtaText()}
          onPress={handlePurchase}
          disabled={isPurchasing || !selectedPackage}
          loading={isPurchasing}
          style={styles.subscribeButton}
        />

        {/* Trial price disclosure (Apple requirement) */}
        {trialEligible && selectedPackage && (
          <Typography variant="caption" style={styles.trialDisclosure}>
            {trialDays}-day free trial, then {selectedPackage.price} {selectedPackage.period}
          </Typography>
        )}

        {/* Restore Purchases */}
        <TouchableOpacity
          onPress={handleRestore}
          disabled={isPurchasing}
          style={styles.restoreButton}
        >
          <Typography
            variant="caption"
            color={theme.primary}
            style={styles.restoreText}
          >
            Restore Purchases
          </Typography>
        </TouchableOpacity>

        {/* Terms and Privacy */}
        <View style={styles.termsContainer}>
          <TouchableOpacity
            onPress={() => openLink('https://seongjooon.github.io/poopai/privacy/')}
          >
            <Typography variant="caption" color={theme.primary} style={styles.link}>
              Privacy Policy
            </Typography>
          </TouchableOpacity>

          <Typography variant="caption" style={styles.separator}>•</Typography>

          <TouchableOpacity
            onPress={() => openLink('https://seongjooon.github.io/poopai/terms/')}
          >
            <Typography variant="caption" color={theme.primary} style={styles.link}>
              Terms of Service
            </Typography>
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <Typography variant="caption" style={styles.disclaimer}>
          Auto-renewable subscription. Cancel anytime from App Store settings.
        </Typography>
      </View>
    </SafeAreaView>
  );
};

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    scrollContent: {
      paddingHorizontal: spacing.l,
      paddingTop: spacing.l,
    },
    header: {
      alignItems: 'center',
      marginBottom: spacing.xl,
      position: 'relative',
    },
    closeButton: {
      position: 'absolute',
      top: -spacing.m,
      right: -spacing.l,
      padding: spacing.m,
      zIndex: 10,
    },
    headerImage: {
      width: '100%',
      height: 200,
      backgroundColor: theme.secondaryBackground,
      borderRadius: 16,
      marginBottom: spacing.l,
      borderWidth: 1,
      borderColor: theme.separator,
    },
    title: {
      textAlign: 'center',
      marginBottom: spacing.s,
      color: theme.label,
    },
    subtitle: {
      textAlign: 'center',
      color: theme.secondaryLabel,
    },
    trialBadge: {
      backgroundColor: theme.success,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.s,
      borderRadius: 20,
      marginTop: spacing.m,
    },
    trialBadgeText: {
      fontWeight: '600',
      fontSize: 14,
    },
    benefitsSection: {
      marginBottom: spacing.l,
    },
    packagesSection: {
      marginBottom: spacing.xl,
    },
    errorContainer: {
      backgroundColor: theme.errorBackground,
      paddingHorizontal: spacing.m,
      paddingVertical: spacing.m,
      borderRadius: 8,
      marginBottom: spacing.m,
      borderWidth: 1,
      borderColor: theme.error,
    },
    footer: {
      borderTopWidth: 1,
      borderTopColor: theme.border,
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.l,
      backgroundColor: theme.background,
    },
    subscribeButton: {
      marginBottom: spacing.s,
    },
    trialDisclosure: {
      textAlign: 'center',
      color: theme.tertiaryLabel,
      marginBottom: spacing.s,
    },
    restoreButton: {
      paddingVertical: spacing.m,
      alignItems: 'center',
    },
    restoreText: {
      fontWeight: '600',
      textDecorationLine: 'underline',
    },
    termsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginVertical: spacing.m,
      gap: spacing.s,
    },
    link: {
      fontWeight: '500',
    },
    separator: {
      color: theme.separator,
    },
    disclaimer: {
      textAlign: 'center',
      color: theme.tertiaryLabel,
      marginTop: spacing.m,
    },
  });
}
