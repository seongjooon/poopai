import React, { useState } from 'react';
import { Linking, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useCameraPermissions } from 'expo-camera';
import { Button, Typography } from '@src/ui/atoms';

const SCAN_INTRO_SEEN_KEY = 'scan_intro_seen';

export default function ScanIntroRoute() {
  const router = useRouter();
  const [permission, requestPermission] = useCameraPermissions();
  const [isLoading, setIsLoading] = useState(false);

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
      <View style={styles.card}>
        <Typography style={styles.icon}>📸</Typography>
        <Typography variant="h1" style={styles.title}>
          First scan tips
        </Typography>
        <Typography variant="body" color="#666D7A" style={styles.subtitle}>
          For best analysis quality, follow these simple rules.
        </Typography>

        <View style={styles.tipBox}>
          <Typography variant="body" style={styles.tip}>• Use bright lighting</Typography>
          <Typography variant="body" style={styles.tip}>• Keep stool centered in frame</Typography>
          <Typography variant="body" style={styles.tip}>• Hold still and avoid blur</Typography>
        </View>
      </View>

      <View style={styles.actions}>
        <Button
          title="Continue to Camera"
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
    paddingHorizontal: 20,
    paddingTop: 70,
    paddingBottom: 34,
  },
  card: {
    backgroundColor: '#F5F7FD',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E5EAF7',
    padding: 22,
  },
  icon: {
    fontSize: 42,
    marginBottom: 14,
  },
  title: {
    color: '#121722',
    marginBottom: 8,
  },
  subtitle: {
    lineHeight: 22,
    marginBottom: 18,
  },
  tipBox: {
    gap: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F5',
    padding: 14,
  },
  tip: {
    color: '#172033',
  },
  actions: {
    marginTop: 'auto',
    gap: 10,
  },
  primaryButton: {
    backgroundColor: '#0D3DFF',
  },
});
