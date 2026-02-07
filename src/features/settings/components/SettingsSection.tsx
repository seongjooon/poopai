import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing, colors } from '@config/theme';

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
  return (
    <View style={[styles.container, style]}>
      <Typography
        variant="caption"
        color={colors.primary}
        style={styles.title}
      >
        {title.toUpperCase()}
      </Typography>
      <View style={styles.content}>{children}</View>
    </View>
  );
};

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
    backgroundColor: colors.background,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
});
