import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { colors, spacing } from '@config/theme';

interface BenefitListProps {
  benefits: string[];
}

export const BenefitList = ({ benefits }: BenefitListProps) => {
  return (
    <View style={styles.container}>
      {benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitRow}>
          <View style={styles.checkmark}>
            <Typography color={colors.success} style={styles.checkmarkText}>
              ✓
            </Typography>
          </View>
          <Typography
            variant="body"
            style={styles.text}
          >
            {benefit}
          </Typography>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.l,
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  checkmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.m,
  },
  checkmarkText: {
    fontSize: 16,
    fontWeight: '700',
  },
  text: {
    flex: 1,
    color: colors.text,
  },
});
