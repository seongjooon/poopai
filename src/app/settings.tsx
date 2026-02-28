import { useRouter } from 'expo-router';
import { SettingsScreen } from '../features/settings';

export default function SettingsRoute() {
  const router = useRouter();

  return <SettingsScreen onClose={() => router.back()} />;
}
