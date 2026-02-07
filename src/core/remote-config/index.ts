import { REMOTE_CONFIG_KEYS, DEFAULT_CONFIG } from './keys';

// Simple hook to get config values.
// In real app, this should hook into Firebase Remote Config or a cached provider.
export const useRemoteConfig = () => {
    const getValue = <T extends keyof typeof DEFAULT_CONFIG>(key: T): typeof DEFAULT_CONFIG[T] => {
        // TODO: Implement actual fetch logic here
        return DEFAULT_CONFIG[key];
    };

    return {
        getValue,
        // Helpers for common flags
        minVersion: getValue(REMOTE_CONFIG_KEYS.MIN_VERSION),
        isMaintenance: getValue(REMOTE_CONFIG_KEYS.MAINTENANCE_MODE),
        isReviewMode: getValue(REMOTE_CONFIG_KEYS.REVIEW_MODE),
        showPaywallOnboarding: getValue(REMOTE_CONFIG_KEYS.SHOW_PAYWALL_ONBOARDING),
    };
};
