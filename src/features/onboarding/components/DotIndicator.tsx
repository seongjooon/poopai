import React from 'react';
import { View, StyleSheet } from 'react-native';
import { spacing, useTheme, type ThemePalette } from '@config/theme';

interface DotIndicatorProps {
  totalSteps: number;
  currentStepIndex: number;
}

export const DotIndicator = ({ totalSteps, currentStepIndex }: DotIndicatorProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      {Array.from({ length: totalSteps }).map((_, index) => (
        <View
          key={index}
          style={[
            styles.dot,
            {
              backgroundColor: index === currentStepIndex ? theme.primary : theme.border,
            },
          ]}
        />
      ))}
    </View>
  );
};

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
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
      borderWidth: StyleSheet.hairlineWidth,
      borderColor: theme.separator,
    },
  });
}
