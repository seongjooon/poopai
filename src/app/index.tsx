import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Typography, Button } from '../ui/atoms';
import { colors, spacing } from '@config/theme';

export default function MainScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Typography variant="h1">PoopAI</Typography>
      <Typography variant="body" color="#666" style={styles.subtitle}>
        Your gut health companion 💩
      </Typography>

      <Button
        title="⚙️ Settings"
        onPress={() => router.push('/settings')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.l,
    gap: spacing.m,
  },
  subtitle: {
    marginBottom: spacing.xl,
  },
});
