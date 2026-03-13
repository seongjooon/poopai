import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing, useTheme } from '@config/theme';

interface VersionInfoProps {
  version: string;
  buildNumber?: string;
}

export const VersionInfo = ({ version, buildNumber }: VersionInfoProps) => {
  const { theme } = useTheme();
  const versionString = buildNumber ? `v${version} (Build ${buildNumber})` : `v${version}`;

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      paddingVertical: spacing.l,
    },
    text: {
      fontWeight: '400',
    },
  });

  return (
    <View style={styles.container}>
      <Typography
        variant="caption"
        color={theme.tertiaryLabel}
        style={styles.text}
      >
        {versionString}
      </Typography>
    </View>
  );
};
