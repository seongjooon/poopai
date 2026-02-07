import { View } from 'react-native';
import { Button } from '../ui/atoms';
import { Typography } from '../ui/atoms';
import { router } from 'expo-router';

export default function Index() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', gap: 20 }}>
      <Typography variant="h1">App Factory Ready 🏭</Typography>
      <Typography variant="body">Architecture: Vertical Slice + Facades</Typography>

      <Button
        title="Start Onboarding (Mock)"
        onPress={() => console.log('Navigate to onboarding')}
        variant="primary"
      />
    </View>
  );
}
