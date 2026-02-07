import React from 'react';
import { View, StyleSheet } from 'react-native';
import { colors, spacing } from '@config/theme';

interface DotIndicatorProps {
  totalSteps: number;
  currentStepIndex: number;
}

export const DotIndicator = ({ totalSteps, currentStepIndex }: DotIndicatorProps) => {
  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentStepIndex ? colors.primary : colors.border,
            },
          ]}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: spacing.s,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
