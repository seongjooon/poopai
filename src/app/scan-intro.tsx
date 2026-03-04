import React from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { Button, Typography } from '@src/ui/atoms';

const SCAN_INTRO_SEEN_KEY = 'scan_intro_seen';

const tips = [
  { icon: '💡', title: 'Good lighting', desc: 'Bright, even light gives the best results' },
  { icon: '🎯', title: 'Center the frame', desc: 'Keep stool centered and fully visible' },
  { icon: '✋', title: 'Hold steady', desc: 'Stay still for a sharp, clear photo' },
];

export default function ScanIntroRoute() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = React.useState(false);

  const continueToCamera = async () => {
    setIsLoading(true);

    try {
      const granted = permission?.granted
        ? true
        : (await requestPermission()).granted;

      if (!granted) {
        setIsLoading(false);
        return;
      }

      await AsyncStorage.setItem(SCAN_INTRO_SEEN_KEY, 'true');
      router.replace('/poop-log');
    } catch {
      setIsLoading(false);
    }
  };

  const denied = Boolean(permission) && !permission?.granted;

  return (
    <View style={styles.container}>
      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={styles.heroIconWrap}>
          <Typography style={styles.heroIcon}>📸</Typography>
        </View>
        <Typography variant="h1" style={styles.title}>
          Ready to scan
        </Typography>
        <Typography variant="body" color="#8B92A1" style={styles.subtitle}>
          Quick tips for the best analysis
        </Typography>
      </View>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        {tips.map((tip, i) => (
          <View key={i} style={styles.tipCard}>
            <View style={styles.tipIconWrap}>
              <Typography style={styles.tipIcon}>{tip.icon}</Typography>
            </View>
            <View style={styles.tipContent}>
              <Typography variant="body" style={styles.tipTitle}>
                {tip.title}
              </Typography>
              <Typography variant="caption" color="#8B92A1" style={styles.tipDesc}>
                {tip.desc}
              </Typography>
            </View>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Typography variant="caption" color="#A4A9B6" style={styles.privacyNote}>
          🔒 Images are analyzed securely and never stored on our servers.
        </Typography>

        <Button
          title="Open Camera"
          onPress={continueToCamera}
          loading={isLoading}
          style={styles.primaryButton}
        />

        {denied && (
          <Button
            title="Open Settings"
            variant="outline"
            onPress={() => Linking.openSettings()}
          />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 34,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  heroIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 28,
    backgroundColor: '#F0F4FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E3E9FF',
  },
  heroIcon: {
    fontSize: 44,
  },
  title: {
    color: '#121722',
    marginBottom: 6,
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    lineHeight: 22,
  },

  // Tips
  tipsContainer: {
    gap: 12,
  },
  tipCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FD',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#ECEEF5',
    gap: 14,
  },
  tipIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E8ECF4',
  },
  tipIcon: {
    fontSize: 22,
  },
  tipContent: {
    flex: 1,
    gap: 2,
  },
  tipTitle: {
    color: '#121722',
    fontWeight: '600',
  },
  tipDesc: {
    lineHeight: 18,
  },

  // Footer
  footer: {
    marginTop: 'auto',
    gap: 12,
  },
  privacyNote: {
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 4,
  },
  primaryButton: {
    backgroundColor: '#0D3DFF',
  },
});
