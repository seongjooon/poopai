import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@src/ui/molecules';
import { Typography } from '@src/ui/atoms';
import { spacing, useTheme, type ThemePalette } from '@config/theme';

interface PaywallPackage {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
}

interface PackageCardProps {
  package: PaywallPackage;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (pkg: PaywallPackage) => void;
}

export const PackageCard = ({ package: pkg, isSelected, isLoading, onSelect }: PackageCardProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={() => !isLoading && onSelect(pkg)}
      disabled={isLoading}
      activeOpacity={0.8}
    >
      <Card
        style={[
          styles.card,
          isSelected && styles.selectedCard,
          pkg.isPopular && styles.popularCard,
        ]}
      >
        {/* Popular Badge */}
        {pkg.isPopular && (
          <View style={styles.badge}>
            <Typography
              variant="caption"
              color={theme.onPrimary}
              style={styles.badgeText}
            >
              Best Value
            </Typography>
          </View>
        )}

        {/* Package Name */}
        <Typography
          variant="h1"
          style={styles.name}
        >
          {pkg.name}
        </Typography>

        {/* Price */}
        <View style={styles.priceSection}>
          <Typography
            variant="h1"
            color={theme.primary}
            style={styles.price}
          >
            {pkg.price}
          </Typography>
          <Typography
            variant="body"
            style={styles.period}
          >
            {pkg.period}
          </Typography>
        </View>

        {/* Savings Badge */}
        {pkg.savings && (
          <View style={styles.savingsBadge}>
            <Typography
              variant="caption"
              color={theme.primary}
            >
              {pkg.savings}
            </Typography>
          </View>
        )}

        {/* Auto-Renewable Text */}
        <Typography
          variant="caption"
          style={styles.disclaimer}
        >
          Auto-renewable. Cancel anytime.
        </Typography>

        {/* Selection Indicator */}
        <View style={styles.selectionContainer}>
          <View
            style={[
              styles.radio,
              isSelected && styles.radioSelected,
            ]}
          >
            {isSelected && <View style={styles.radioDot} />}
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    card: {
      marginBottom: spacing.m,
      paddingVertical: spacing.l,
      paddingHorizontal: spacing.m,
      borderWidth: 2,
      borderColor: theme.border,
      position: 'relative',
    },
    selectedCard: {
      borderColor: theme.primary,
      backgroundColor: theme.accentBackground,
    },
    popularCard: {
      borderColor: theme.primary,
    },
    badge: {
      position: 'absolute',
      top: -12,
      right: spacing.m,
      backgroundColor: theme.success,
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
      borderRadius: 12,
    },
    badgeText: {
      fontWeight: '600',
    },
    name: {
      fontSize: 24,
      fontWeight: '700',
      marginBottom: spacing.s,
      color: theme.label,
    },
    priceSection: {
      marginVertical: spacing.m,
    },
    price: {
      fontSize: 32,
      fontWeight: '700',
    },
    period: {
      marginTop: spacing.s,
      color: theme.secondaryLabel,
    },
    savingsBadge: {
      backgroundColor: theme.warningBackground,
      borderWidth: 1,
      borderColor: theme.warning,
      paddingVertical: spacing.s,
      paddingHorizontal: spacing.m,
      borderRadius: 8,
      marginVertical: spacing.m,
      alignItems: 'center',
    },
    disclaimer: {
      marginVertical: spacing.m,
      color: theme.tertiaryLabel,
    },
    selectionContainer: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: spacing.m,
    },
    radio: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: theme.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
    radioSelected: {
      borderColor: theme.primary,
    },
    radioDot: {
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: theme.primary,
    },
  });
}
