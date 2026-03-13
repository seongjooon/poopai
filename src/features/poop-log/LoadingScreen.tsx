import React from 'react';
import { ActivityIndicator, Image, StyleSheet, View } from 'react-native';
import { Typography } from '@src/ui/atoms';
import { useTheme, type ThemePalette } from '@config/theme';

export function LoadingScreen() {
  const { theme, isDark } = useTheme();
  const styles = React.useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  return (
    <View style={styles.container}>
      <View style={styles.logoShell}>
        <Image
          source={require('../../../assets/icon.png')}
          style={styles.logoImage}
          resizeMode="cover"
        />
      </View>

      <Typography variant="h1" style={styles.title}>
        Poop AI
      </Typography>
      <Typography variant="body" color={theme.secondaryLabel} style={styles.subtitle}>
        Poop Tracker
      </Typography>

      <View style={styles.loaderRow}>
        <ActivityIndicator size="small" color={theme.primary} />
        <Typography variant="caption" color={theme.secondaryLabel}>
          Analyzing...
        </Typography>
      </View>
    </View>
  );
}

function createStyles(theme: ThemePalette, isDark: boolean) {
  return StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.background,
      paddingHorizontal: 24,
    },
    logoShell: {
      width: 132,
      height: 132,
      borderRadius: 30,
      overflow: 'hidden',
      backgroundColor: theme.elevatedBackground,
      shadowColor: '#000000',
      shadowOpacity: isDark ? 0.45 : 0.14,
      shadowRadius: 16,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
      marginBottom: 18,
    },
    logoImage: {
      width: '100%',
      height: '100%',
    },
    title: {
      color: theme.label,
      fontSize: 38,
      fontWeight: '700',
      letterSpacing: -0.8,
    },
    subtitle: {
      marginTop: 2,
      marginBottom: 24,
      fontSize: 17,
    },
    loaderRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
  });
}
