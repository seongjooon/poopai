import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@src/ui/molecules';
import { Typography } from '@src/ui/atoms';
import { colors, spacing } from '@config/theme';
import type { Package } from '../usePaywall';

interface PackageCardProps {
  package: Package;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (pkg: Package) => void;
}

export const PackageCard = ({ package: pkg, isSelected, isLoading, onSelect }: PackageCardProps) => {
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
              color="#FFFFFF"
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
            color={colors.primary}
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
              color={colors.primary}
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

const styles = StyleSheet.create({
  card: {
    marginBottom: spacing.m,
    paddingVertical: spacing.l,
    paddingHorizontal: spacing.m,
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
  },
  selectedCard: {
    borderColor: colors.primary,
    backgroundColor: '#F0F7FF',
  },
  popularCard: {
    borderColor: colors.primary,
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: spacing.m,
    backgroundColor: colors.success,
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
    color: '#666666',
  },
  savingsBadge: {
    backgroundColor: '#FFF3CD',
    paddingVertical: spacing.s,
    paddingHorizontal: spacing.m,
    borderRadius: 8,
    marginVertical: spacing.m,
    alignItems: 'center',
  },
  disclaimer: {
    marginVertical: spacing.m,
    color: '#999999',
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
    borderColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioSelected: {
    borderColor: colors.primary,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: colors.primary,
  },
});
