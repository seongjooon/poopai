import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { spacing } from '@config/theme';

interface VersionInfoProps {
  version: string;
  buildNumber?: string;
}

export const VersionInfo = ({ version, buildNumber }: VersionInfoProps) => {
  const versionString = buildNumber ? `v${version} (Build ${buildNumber})` : `v${version}`;

  return (
    <View style={styles.container}>
      <Typography
        variant="caption"
        color="#999999"
        style={styles.text}
      >
        {versionString}
      </Typography>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: spacing.l,
  },
  text: {
    fontWeight: '400',
  },
});
