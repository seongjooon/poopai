import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { spacing, useTheme, type ThemePalette } from '@config/theme';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundaryClass extends Component<Props & { theme: ThemePalette }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  handleRestart = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      const styles = createStyles(this.props.theme);

      return (
        <View style={styles.container}>
          <Text style={styles.emoji}>:(</Text>
          <Text style={styles.title}>Something went wrong</Text>
          <Text style={styles.message}>
            An unexpected error occurred.{`\n`}Please restart the app.
          </Text>
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleRestart}
          >
            <Text style={styles.buttonText}>Restart</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

export function ErrorBoundary({ children }: Props) {
  const { theme } = useTheme();
  return <ErrorBoundaryClass theme={theme}>{children}</ErrorBoundaryClass>;
}

function createStyles(theme: ThemePalette) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      alignItems: 'center',
      justifyContent: 'center',
      paddingHorizontal: spacing.l,
    },
    emoji: {
      fontSize: 48,
      marginBottom: spacing.m,
      color: theme.label,
    },
    title: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.label,
      marginBottom: spacing.s,
    },
    message: {
      fontSize: 16,
      color: theme.secondaryLabel,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: spacing.xl,
    },
    button: {
      backgroundColor: theme.primary,
      paddingVertical: spacing.m,
      paddingHorizontal: spacing.l,
      borderRadius: 12,
      minWidth: 200,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.onPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
  });
}
