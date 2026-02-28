import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { OnboardingScreen } from '../features/onboarding';

export default function OnboardingRoute() {
  const router = useRouter();

  const handleComplete = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    router.replace('/login');
  };

  return (
    <OnboardingScreen
      onNavigateToPaywall={handleComplete}
      onNavigateToMain={handleComplete}
    />
  );
}
