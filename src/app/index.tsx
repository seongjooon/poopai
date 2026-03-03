import { Alert, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Typography, Button } from '../ui/atoms';
import { colors, spacing } from '@config/theme';

const SCAN_INTRO_SEEN_KEY = 'scan_intro_seen';

export default function MainScreen() {
  const router = useRouter();

  const handleScanPress = async () => {
    try {
      const seen = await AsyncStorage.getItem(SCAN_INTRO_SEEN_KEY);
      if (seen === 'true') {
        router.push('/poop-log');
      } else {
        router.push('/scan-intro');
      }
    } catch {
      Alert.alert('Error', 'Could not open scanner. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Typography variant="h1">PoopAI</Typography>
        <Typography variant="body" color="#666D7A">
          Your gut health companion 💩
        </Typography>
      </View>

      <View style={styles.card}>
        <Typography variant="body" style={styles.cardTitle}>
          Quick Scan Ready
        </Typography>
        <Typography variant="caption" color="#667085">
          Tap the + button to start your stool analysis in seconds.
        </Typography>
      </View>

      <View style={styles.bottomArea}>
        <Button title="⚙️ Settings" onPress={() => router.push('/settings')} />
      </View>

      <View style={styles.fabWrap}>
        <Button title="＋" onPress={handleScanPress} style={styles.fab} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.l,
    paddingTop: spacing.xl,
  },
  header: {
    gap: 6,
    marginBottom: spacing.l,
  },
  card: {
    backgroundColor: '#F4F6FB',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#E8ECF6',
    padding: spacing.l,
  },
  cardTitle: {
    marginBottom: 6,
    fontWeight: '600',
    color: '#121722',
  },
  bottomArea: {
    marginTop: 'auto',
    marginBottom: 42,
  },
  fabWrap: {
    position: 'absolute',
    right: 22,
    bottom: 120,
  },
  fab: {
    width: 62,
    height: 62,
    borderRadius: 31,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 0,
    paddingHorizontal: 0,
    shadowColor: '#0D3DFF',
    shadowOpacity: 0.24,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 8,
  },
});
