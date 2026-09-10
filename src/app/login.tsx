import { LoginScreen } from '../features/login';
import { usePayments } from '../core/payments';

export default function LoginRoute() {
  const handleComplete = async () => {
    // After login, payment state will update and _layout route guard handles navigation
    await usePayments.getState().initialize();
  };

  return <LoginScreen onComplete={handleComplete} />;
}
