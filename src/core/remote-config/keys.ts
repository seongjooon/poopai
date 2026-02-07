export const REMOTE_CONFIG_KEYS = {
    MIN_VERSION: 'global_min_version',
    MAINTENANCE_MODE: 'global_maintenance_mode',
    REVIEW_MODE: 'global_review_mode',
    SHOW_PAYWALL_ONBOARDING: 'paywall_onboarding_show',
} as const;

export const DEFAULT_CONFIG = {
    [REMOTE_CONFIG_KEYS.MIN_VERSION]: '1.0.0',
    [REMOTE_CONFIG_KEYS.MAINTENANCE_MODE]: false,
    [REMOTE_CONFIG_KEYS.REVIEW_MODE]: false,
    [REMOTE_CONFIG_KEYS.SHOW_PAYWALL_ONBOARDING]: true,
};
