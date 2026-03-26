// 🔐 API Keys & Secrets Configuration
//
// This file contains all API keys and sensitive credentials.
// It's .gitignored to prevent accidental leaks.
//
// ⚠️ IMPORTANT: Fill in the real values before running the app!
// See docs/SETUP_CHECKLIST.md for step-by-step instructions.

export const SECRETS = {
  // 🔵 RevenueCat (In-App Purchases & Subscriptions)
  // Get this from: https://app.revenuecat.com/projects
  // Navigate to: Project Settings → API Keys → Public SDK key
  REVENUECAT_PUBLIC_KEY: process.env.EXPO_PUBLIC_RC_KEY ?? 'appl_vEEroEaLIZzcrisWsGJxlVRiDiR',

  // 🟢 Supabase (Backend & Authentication)
  // Get these from: https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
  // URL format: https://xxxxxxxxxxxxx.supabase.co
  SUPABASE_URL: process.env.EXPO_PUBLIC_SUPABASE_URL ?? 'https://dygvboedlmneorrzrrkj.supabase.co',

  // This is the "anon" / "public" key (NOT the service_role key!)
  SUPABASE_ANON_KEY: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5Z3Zib2VkbG1uZW9ycnpycmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0MDM0NzcsImV4cCI6MjA4NTk3OTQ3N30.tYsZEgyUZv8BX32Ph-dr81bwdKSZLCbamjuk0N8XY1w',

  // 🔴 Google Sign-In (Android & Web)
  // Get this from: https://console.cloud.google.com/apis/credentials
  // Type: OAuth 2.0 Client ID → Web application
  // Format: xxxxxx-xxxxxxxx.apps.googleusercontent.com
  GOOGLE_WEB_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '1012194700117-3cft6erfc96014b7rpgv7ucv929698b.apps.googleusercontent.com',

  // 📊 Mixpanel (Analytics) - OPTIONAL
  // Get this from: https://mixpanel.com/project/YOUR_PROJECT/settings
  // You can leave this as placeholder if not using analytics
  MIXPANEL_TOKEN: process.env.EXPO_PUBLIC_MIXPANEL_TOKEN ?? 'c187a0571f16670405627d3b9a89917b',
};

// ⚠️ Development Warnings
// These will show in console if keys are not configured
if (__DEV__) {
  if (SECRETS.SUPABASE_URL === 'https://your-project.supabase.co' || SECRETS.SUPABASE_URL === 'https://dygvboedlmneorrzrrkj.supabase.co') {
    if (SECRETS.SUPABASE_URL === 'https://your-project.supabase.co') {
      console.warn('⚠️  [Config] Supabase URL is missing. Auth will not work.');
      console.warn('    → See docs/SUPABASE_SETUP.md for instructions');
    } else {
      console.log('✅ [Config] Supabase configured successfully');
    }
  } else {
    console.log('✅ [Config] Supabase configured successfully');
  }

  if (SECRETS.REVENUECAT_PUBLIC_KEY === 'appl_PlaceholderKey') {
    console.warn('⚠️  [Config] RevenueCat Key is missing. Purchases will not work.');
    console.warn('    → See docs/REVENUECAT_SETUP.md for instructions');
  }

  if (SECRETS.GOOGLE_WEB_CLIENT_ID === 'your-google-web-client-id.apps.googleusercontent.com') {
    console.warn('⚠️  [Config] Google Web Client ID is missing. Google Sign-In will not work.');
    console.warn('    → See docs/AUTH_PROVIDERS_SETUP.md for instructions');
  }
}

// ✅ Helper to check if services are configured
export const isConfigured = {
  supabase: SECRETS.SUPABASE_URL !== 'https://your-project.supabase.co',
  revenueCat: SECRETS.REVENUECAT_PUBLIC_KEY !== 'appl_PlaceholderKey',
  googleAuth: SECRETS.GOOGLE_WEB_CLIENT_ID !== 'your-google-web-client-id.apps.googleusercontent.com',
  mixpanel: SECRETS.MIXPANEL_TOKEN !== 'your-mixpanel-token',
};
