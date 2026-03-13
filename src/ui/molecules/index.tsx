import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';
import { spacing, useTheme, type ThemePalette } from '@config/theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Card = ({ children, style }: CardProps) => {
  const { theme } = useTheme();
  const styles = React.useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={[styles.card, style]}>
      {children}
    </View>
  );
};

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.elevatedBackground,
      borderRadius: 16,
      padding: spacing.m,
      shadowColor: theme.label,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 3,
      borderWidth: 1,
      borderColor: theme.border,
    },
  });
}
