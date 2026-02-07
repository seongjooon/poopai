import React from 'react';
import {
  TouchableOpacity,
  View,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Typography } from '@src/ui/atoms';
import { colors, spacing } from '@config/theme';

interface SettingsItemProps {
  label: string;
  value?: string;
  onPress: () => void;
  disabled?: boolean;
  isDangerous?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export const SettingsItem = ({
  label,
  value,
  onPress,
  disabled = false,
  isDangerous = false,
  style,
  labelStyle,
}: SettingsItemProps) => {
  const labelColor = isDangerous ? colors.error : colors.text;

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : 0.7}
      style={[styles.container, disabled && styles.disabled, style]}
    >
      <View style={styles.content}>
        <Typography
          color={labelColor}
          style={[
            styles.label,
            isDangerous && styles.dangerousLabel,
            labelStyle,
          ]}
        >
          {label}
        </Typography>
        {value && (
          <Typography
            variant="caption"
            color="#999999"
            style={styles.value}
          >
            {value}
          </Typography>
        )}
      </View>

      {/* Chevron Icon */}
      <Typography
        color={isDangerous ? colors.error : colors.primary}
        style={styles.chevron}
      >
        ›
      </Typography>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  disabled: {
    opacity: 0.5,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: spacing.s,
  },
  dangerousLabel: {
    fontWeight: '600',
  },
  value: {
    marginTop: spacing.s,
  },
  chevron: {
    fontSize: 24,
    marginLeft: spacing.m,
  },
});
