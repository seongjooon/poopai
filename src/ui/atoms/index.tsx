import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { spacing, typography, useTheme } from '@config/theme';

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textColor?: string;
}

export const Button = React.memo(
  ({
    title,
    onPress,
    variant = 'primary',
    disabled = false,
    loading = false,
    style,
    textColor,
  }: ButtonProps) => {
    const { theme } = useTheme();
    
    const backgroundColor = disabled
      ? theme.tertiaryBackground
      : variant === 'primary'
        ? theme.primary
        : variant === 'secondary'
          ? theme.secondaryBackground
          : 'transparent';

    const borderColor = variant === 'outline' || variant === 'secondary' ? theme.primary : 'transparent';
    const borderWidth = variant === 'outline' || variant === 'secondary' ? 1 : 0;

    const resolvedTextColor = disabled
      ? theme.tertiaryLabel
      : textColor || (variant === 'primary' ? theme.onPrimary : theme.primary);

    return (
      <TouchableOpacity
        style={[styles.button, { backgroundColor, borderColor, borderWidth }, style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color={resolvedTextColor} />
        ) : (
          <Text style={[styles.text, { color: resolvedTextColor }]}>{title}</Text>
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
  style?: StyleProp<TextStyle>;
}

export const Typography = React.memo(
  ({
    variant = 'body',
    color,
    children,
    style,
  }: TypographyProps) => {
    const { theme } = useTheme();
    const textColor = color || theme.label;
    return (
      <Text style={[typography[variant], { color: textColor }, style]}>
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
