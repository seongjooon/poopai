import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, typography } from '@config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

export const Button = React.memo(
  ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
  }: ButtonProps) => {
    const backgroundColor = disabled
      ? colors.border
      : variant === 'primary'
        ? colors.primary
        : variant === 'secondary'
          ? colors.background
          : 'transparent';

    const textColor = variant === 'primary' ? '#FFFFFF' : colors.primary;

    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor }, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={textColor} />
        ) : (
          <Text style={[styles.text, { color: textColor }]}>{title}</Text>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

interface TypographyProps {
  variant?: keyof typeof typography;
  color?: string;
  children: React.ReactNode;
  style?: TextStyle;
}

export const Typography = React.memo(
  ({
    variant = 'body',
    color = colors.text,
    children,
    style,
  }: TypographyProps) => {
    return (
      <Text style={[typography[variant], { color }, style]}>
        {children}
      </Text>
    );
  }
);

Typography.displayName = 'Typography';

const styles = StyleSheet.create({
  button: {
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.l,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
});
