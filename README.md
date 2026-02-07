# App Factory Template

React Native (Expo) boilerplate for rapid app development with LLM-assisted workflow.

## Quick Start

### 1. Create from Template
Click **"Use this template"** on GitHub → Create new repository

### 2. Clone & Install
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_APP_NAME.git
cd YOUR_APP_NAME
npm install
```

### 3. Configure App Identity
Edit `app.json`:
```json
{
  "name": "My App Name",
  "slug": "my-app-name",
  "ios": { "bundleIdentifier": "com.mycompany.myapp" },
  "android": { "package": "com.mycompany.myapp" },
  "scheme": "myapp"
}
```

### 4. Set API Keys
Copy `config/secrets.example.ts` → `config/secrets.ts` and fill in:
```typescript
SUPABASE_URL: 'https://xxx.supabase.co'
SUPABASE_ANON_KEY: 'xxx'
REVENUECAT_PUBLIC_KEY: 'appl_xxx'
GOOGLE_WEB_CLIENT_ID: 'xxx.apps.googleusercontent.com'
```

### 5. Run
```bash
npx expo start
```

## Project Structure

```
src/
├── core/           # Auth, Payments, Analytics (don't modify for features)
├── features/       # Your app features (vertical slices)
├── ui/             # Reusable components (Button, Card, Typography)
└── lib/            # Utilities (Supabase client)

config/
├── theme.ts        # Colors, spacing, typography
├── contents.json   # App copy/text
└── secrets.ts      # API keys (gitignored)
```

## Adding Features

Use the Claude Code workflow:

1. Fill out `docs/FEATURE_BLUEPRINT_TEMPLATE.md`
2. Run `/implement-feature` and paste the blueprint
3. Run `/verify-app` to check build

## What's Included

- **Onboarding**: Slide-based welcome flow
- **Login**: Apple (iOS) / Google (Android) / Guest
- **Paywall**: Subscription screen (RevenueCat ready)
- **Settings**: Account, legal links, delete account
- **Error Boundary**: Crash protection

## App Store Checklist

Already implemented:
- [x] Privacy Policy link
- [x] Terms of Service link
- [x] Delete Account
- [x] Restore Purchases
- [x] Subscription disclaimers

Need to add per app:
- [ ] App icon (replace `assets/icon.png`)
- [ ] Splash screen (replace `assets/splash-icon.png`)
- [ ] Real API keys in `config/secrets.ts`
