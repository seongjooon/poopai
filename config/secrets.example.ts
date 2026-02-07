// Copy this file to config/secrets.ts and fill in your real keys.
// config/secrets.ts is .gitignored to prevent accidental key leaks.

export const SECRETS = {
    REVENUECAT_PUBLIC_KEY: process.env.EXPO_PUBLIC_RC_KEY ?? 'appl_PlaceholderKey',
    SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://your-project.supabase.co',
    SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'your-anon-key',
    GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? 'your-google-web-client-id',
    MIXPANEL_TOKEN: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN ?? 'your-mixpanel-token',
};

// Helper to warn dev if keys are missing
if (SECRETS.SUPABASE_URL === 'https://your-project.supabase.co') {
    console.warn('[Config] Supabase URL is missing. Check config/secrets.ts');
}
if (SECRETS.REVENUECAT_PUBLIC_KEY === 'appl_PlaceholderKey') {
    console.warn('[Config] RevenueCat Key is missing. Check config/secrets.ts');
}
