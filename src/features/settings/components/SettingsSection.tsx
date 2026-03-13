import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing, useTheme } from '@config/theme';

interface SettingsSectionProps {
  title: string;
  children: React.ReactNode;
  style?: ViewStyle;
}

export const SettingsSection = ({
  title,
  children,
  style,
}: SettingsSectionProps) => {
  const { theme } = useTheme();
  
  const styles = StyleSheet.create({
    container: {
      marginVertical: spacing.m,
    },
    title: {
      fontWeight: '700',
      paddingHorizontal: spacing.l,
      paddingVertical: spacing.m,
      fontSize: 12,
    },
    content: {
      backgroundColor: theme.background,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      borderColor: theme.separator,
    },
  });
  
  return (
    <View style={[styles.container, style]}>
      <Typography
        variant="caption"
        color={theme.secondaryLabel}
        style={styles.title}
      >
        {title.toUpperCase()}
      </Typography>
      <View style={styles.content}>{children}</View>
    </View>
  );
};
