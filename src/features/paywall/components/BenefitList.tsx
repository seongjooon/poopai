import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing, useTheme, type ThemePalette } from '@config/theme';

interface BenefitListProps {
  benefits: string[];
}

export const BenefitList = ({ benefits }: BenefitListProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {benefits.map((benefit, index) => (
        <View key={index} style={styles.benefitRow}>
          <View style={styles.checkmark}>
            <Typography color={theme.success} style={styles.checkmarkText}>
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

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
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
      backgroundColor: theme.successBackground,
      borderWidth: 1,
      borderColor: theme.success,
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
      color: theme.label,
    },
  });
}
