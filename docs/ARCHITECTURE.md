# 🏗️ App Factory Template - Architecture

## 📋 Overview

**App Factory Template** is a React Native (Expo) boilerplate designed for **Vertical Slice Architecture** and **LLM-Assisted Development**.

The template enables AI (Claude) to autonomously generate complete features from a simple blueprint.

---

## 🏭 Core Architecture Principles

### **1. Vertical Slice Architecture**

Each feature is a **complete, self-contained vertical slice**:
- Schema (Data structure)
- Logic (State management, API calls)
- UI (Components)
- Entry point (index.tsx)

**Benefit**: Features are independent and can be developed/reviewed in isolation.

### **2. Layered Structure**

```
┌─────────────────────────────────────────┐
│         App Entry Point (App.tsx)       │
│     Route-based State Management        │
└──────────────────┬──────────────────────┘
                   │
        ┌──────────┼──────────┐
        ▼          ▼          ▼
   [Features]   [Core]      [UI]
   (Business)   (Cross-cut) (Dumb)
```

#### **src/features/** - Business Logic
Each feature is a self-contained folder:
- `useFeature.ts` - State & mutations
- `schema.ts` - Zod data validation
- `components/` - Feature-specific UI
- `index.tsx` - Public API (only export)

#### **src/core/** - Cross-Cutting Concerns
Domain-agnostic utilities (never touch when building features):
- `auth/` - Authentication (Zustand)
- `payments/` - Subscription management (Zustand mock)
- `remote-config/` - Feature flags
- `error/`, `network/`, `analytics/` - Infrastructure

#### **src/ui/** - Dumb Components
Reusable, stateless UI primitives:
- `atoms/` - Button, Typography
- `molecules/` - Card, List
- `organisms/` - Complex layouts (future)

#### **config/** - App Configuration
- `contents.json` - Marketing copy, content
- `theme.ts` - Colors, spacing, typography

---

## 🔄 Data Flow

### **Feature State Management**

```
┌────────────────────────────────────────────┐
│          useFeature() Hook                 │
│  (Zustand store or local useState)         │
└─────────────┬────────────────────┬─────────┘
              │                    │
        ┌─────▼──────┐      ┌──────▼─────┐
        │ State       │      │ Actions    │
        │ - data      │      │ - fetch()  │
        │ - loading   │      │ - create() │
        │ - error     │      │ - delete() │
        └─────┬──────┘      └──────┬─────┘
              │                    │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │   Components       │
              │   (Render state)   │
              └────────────────────┘
```

### **Inter-Feature Communication**

```
Feature A              Feature B
  ├─ useAuth()          ├─ useAuth()
  └─ usePayments()      └─ usePayments()
         │                   │
         └─────────┬─────────┘
                   │
            ┌──────▼──────────┐
            │  Shared Core    │
            │  (Zustand)      │
            └─────────────────┘
```

Features communicate **only through Core** (never directly).

---

## 📱 Current Implementation

### **Onboarding Feature**

**Purpose**: Welcome new users & decide Paywall entry

**Flow**:
```
1. App starts → Check AsyncStorage for 'onboarding_completed'
2. If missing → Show OnboardingScreen
3. Load slides from config/contents.json
4. Last slide → Check useRemoteConfig().showPaywallOnboarding
5. If true → Paywall
   If false → Mark completed + Main App
```

**Files**:
```
src/features/onboarding/
├── index.tsx              # OnboardingScreen component
├── useOnboarding.ts       # Logic: step management
├── schema.ts              # Zod schema for validation
└── components/
    ├── Slide.tsx          # Single slide UI
    └── DotIndicator.tsx   # Progress indicator
```

---

### **Paywall Feature**

**Purpose**: Convert free users to Pro subscribers

**Flow**:
```
1. Show Pro benefits list (from config/contents.json)
2. Display 2+ subscription options (Monthly/Annual)
3. User selects → handlePurchase() → usePayments().purchasePackage()
4. Success → isPro = true → Main App
```

**Files**:
```
src/features/paywall/
├── index.tsx              # PaywallScreen component
├── usePaywall.ts          # Purchase logic
└── components/
    ├── PackageCard.tsx    # Subscription option card
    └── BenefitList.tsx    # Pro features list
```

**Compliance**:
- ✅ Privacy Policy & Terms links
- ✅ "Auto-renewable" & "Cancel anytime" text
- ✅ Restore Purchases button

---

### **Settings Feature**

**Purpose**: Account management & App Store requirements

**Sections**:
```
1. Pro Status Banner (if not Pro)
2. Account
   - User ID
   - Sign in with Apple (if guest)
   - Sign Out (if logged in)
   - Delete Account (red, destructive)
3. Support & Legal
   - Contact Us (email)
   - Restore Purchases
   - Privacy Policy (link)
   - Terms of Service (link)
4. Version Info (v1.0.0)
```

**Files**:
```
src/features/settings/
├── index.tsx              # SettingsScreen component
├── useSettings.ts         # Auth/Payments/Linking logic
└── components/
    ├── SettingsItem.tsx   # Reusable row
    ├── SettingsSection.tsx # Section grouping
    └── VersionInfo.tsx    # Version footer
```

---

## 🎯 Design Principles Applied

### **1. Separation of Concerns**
- **Logic** (useFeature.ts) ≠ **UI** (components/)
- Core modules ≠ Feature modules
- Dumb UI ≠ Smart containers

### **2. Type Safety**
- Zod schemas for runtime validation
- TypeScript strict mode
- Props interfaces on all components

### **3. Reusability**
- Dumb UI components (Button, Card, Typography)
- Composable sections (SettingsItem, SettingsSection)
- Shared utilities in `src/core/`

### **4. Testability**
- Pure functions in `utils/`
- Mockable Core modules (Zustand)
- Isolated components

### **5. Accessibility**
- Semantic HTML structure
- Touch targets ≥ 44pt (iOS)
- Color contrast compliance

---

## 🔌 Core Integrations

### **Authentication (useAuth)**
```typescript
{
  user: User | null,
  isLoading: boolean,
  signInWithApple: () => Promise<void>,
  signInAnonymously: () => Promise<void>,
  signOut: () => Promise<void>,
  deleteAccount: () => Promise<void>,
}
```

### **Payments (usePayments)**
```typescript
{
  isPro: boolean,
  customerInfo: any | null,
  offerings: any | null,
  purchasePackage: (pkg: Package) => Promise<void>,
  restorePurchases: () => Promise<void>,
}
```

### **Remote Config (useRemoteConfig)**
```typescript
{
  getValue: (key: string) => any,
  minVersion: string,
  isMaintenance: boolean,
  isReviewMode: boolean,
  showPaywallOnboarding: boolean,
}
```

---

## 🚦 App State Machine

```
[Loading]
    ↓ (check AsyncStorage)
    ├─ YES → [Main App]
    └─ NO  → [Onboarding]
               ↓ (Get Started)
               ├─ showPaywallOnboarding?
               │  YES → [Paywall]
               │         ↓ (purchase/restore)
               │         → [Main App]
               │  NO  → [Main App]
               └─ Skip → [Main App]

From [Main App]:
├─ Settings Button → [Settings]
└─ Paywall Button (dev) → [Paywall]
```

---

## 🛠️ Path Aliases

```typescript
// Instead of: import { Button } from '../../../ui/atoms'
import { Button } from '@src/ui/atoms';

// Instead of: import { colors } from '../../../config/theme'
import { colors } from '@config/theme';
```

**Configuration** in `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@config/*": ["config/*"],
      "@src/*": ["src/*"]
    }
  }
}
```

---

## 📦 Dependencies

### **Core**
- `react`, `react-native`, `expo` - Framework
- `zustand` - State management
- `zod` - Schema validation
- `@react-native-async-storage/async-storage` - Persistence

### **Optional (to add)**
- `supabase-js` - Backend
- `react-native-revenue-cat` - Actual RevenueCat
- `expo-router` - Advanced routing

---

## 🎓 Best Practices

### ✅ DO
- Keep features self-contained
- Import only what you need
- Use Zod for data validation
- Test with AsyncStorage mocks
- Follow iOS HIG guidelines

### ❌ DON'T
- Import Core into Core
- Create circular dependencies
- Mix business logic with UI
- Hardcode strings (use config/)
- Mutate Zustand state directly

---

## 🚀 Creating New Features

1. Copy `docs/FEATURE_BLUEPRINT_TEMPLATE.md`
2. Fill in the details
3. Paste to Claude: _"Implement this feature"_
4. Review generated code
5. Test on simulator

See `docs/blueprints/` for examples.

---

## 📚 File Organization Checklist

```
✅ Feature folder has index.tsx
✅ All exports from index.tsx only
✅ useFeature hook exists
✅ schema.ts with Zod validation
✅ components/ for UI
✅ No circular imports
✅ Path aliases used (@src, @config)
✅ TypeScript strict mode
✅ Comments on complex logic
```

---

**Next Step**: Check `FEATURE_BLUEPRINT_TEMPLATE.md` to create your next feature! 🏭✨
