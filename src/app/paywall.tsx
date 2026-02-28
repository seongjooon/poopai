import { PaywallScreen } from '../features/paywall';

export default function PaywallRoute() {
  // Hard paywall — no close button, no escape
  // Route guard in _layout will redirect to main when isPro becomes true
  return <PaywallScreen isHardPaywall={true} />;
}
