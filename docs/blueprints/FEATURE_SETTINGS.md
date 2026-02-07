# Feature Blueprint: Settings Dashboard

**Role**: Expert React Native developer
**Goal**: Create compliant Settings screen handling Account, Support, Legal, and App Info.

---

## 1. Feature Overview

**Location**: `src/features/settings/`

**One-Liner**: Centralized settings dashboard for account management and app compliance.

**Analogy**: Like iOS Settings app with account, support, and legal sections.

**User Flow**:
```
Main App
  ↓ (Tap Settings)
Settings Screen
  ├─ Account
  │  ├─ User ID (view)
  │  ├─ Sign In with Apple (if guest)
  │  ├─ Sign Out (if logged in)
  │  └─ Delete Account (red, destructive)
  ├─ Support & Legal
  │  ├─ Contact Us (email)
  │  ├─ Restore Purchases
  │  ├─ Privacy Policy (link)
  │  └─ Terms of Service (link)
  └─ Footer
     └─ Version (v1.0.0 Build 1)
```

---

## 2. Data & Schema

**No data schema** (configuration only)

Uses:
- `useAuth()` for user info
- `usePayments()` for restore purchases
- `useRemoteConfig()` for feature flags
- `Linking` for external URLs

---

## 3. Core Dependencies

### **Auth**
- ✅ `useAuth().user` → Get user info
- ✅ `useAuth().signInWithApple()` → Sign in
- ✅ `useAuth().signOut()` → Sign out
- ✅ `useAuth().deleteAccount()` → Delete account

### **Payments**
- ✅ `usePayments().restorePurchases()` → Recover subscriptions
- ✅ `usePayments().isPro` → Show Pro status

### **Remote Config**
- ✅ `useRemoteConfig().isReviewMode` → Conditional UI

### **External APIs**
- ✅ `Linking.openURL()` → Open Privacy/Terms links
- ✅ `mailto:` scheme → Send support email

---

## 4. UI States

### **Logged Out (Guest User)**
```
┌──────────────────────────┐
│ Settings                 │
├──────────────────────────┤
│ 🔴 Upgrade to Pro        │ (if not Pro)
├──────────────────────────┤
│ ACCOUNT                  │
├──────────────────────────┤
│ Account ID               │ (view only)
│ Guest User               │
├──────────────────────────┤
│ Sign in with Apple       │ (button row)
│ Save your progress       │
├──────────────────────────┤
│ SUPPORT & LEGAL          │
├──────────────────────────┤
│ Contact Support          │ (email)
│ Restore Purchases        │
│ Privacy Policy           │ (link)
│ Terms of Service         │ (link)
├──────────────────────────┤
│ v1.0.0 (Build 1)         │
└──────────────────────────┘
```

### **Logged In (Real User)**
```
┌──────────────────────────┐
│ Settings                 │
├──────────────────────────┤
│ 🔴 Upgrade to Pro        │ (if not Pro)
├──────────────────────────┤
│ ACCOUNT                  │
├──────────────────────────┤
│ Account ID               │
│ user-12345...            │
├──────────────────────────┤
│ Email                    │
│ user@example.com         │
├──────────────────────────┤
│ Sign Out                 │
├──────────────────────────┤
│ DANGER ZONE              │ (only for logged in)
├──────────────────────────┤
│ Delete Account           │ (red text, icon)
│ Permanent action         │
├──────────────────────────┤
│ SUPPORT & LEGAL          │
├──────────────────────────┤
│ Contact Support          │
│ Restore Purchases        │
│ Privacy Policy           │
│ Terms of Service         │
├──────────────────────────┤
│ v1.0.0 (Build 1)         │
└──────────────────────────┘
```

---

## 5. Feature Screens

### **Settings Screen**

**Purpose**: Account management + app requirements (compliance)

**Sections**:

#### **Pro Status Banner** (if not Pro)
```
┌────────────────────────────┐
│ Upgrade to Pro for         │
│ unlimited access           │ (blue background, white text)
└────────────────────────────┘
```

#### **Account Section**
- User ID (tap → show alert with full ID)
- Conditionally:
  - Guest: "Sign in with Apple" → `useAuth().signInWithApple()`
  - Logged in: Email, "Sign Out" → Alert confirm, then `useAuth().signOut()`

#### **Danger Zone Section** (Logged in only)
- "Delete Account" (red text)
- → Alert: "This will permanently delete your account..."
- → Confirm: `useAuth().deleteAccount()`

#### **Support & Legal Section**
- Contact Support → `Linking.openURL('mailto:support@example.com')`
- Restore Purchases → `usePayments().restorePurchases()`
- Privacy Policy → `Linking.openURL('https://example.com/privacy')`
- Terms of Service → `Linking.openURL('https://example.com/terms')`

#### **Footer**
- Version: `v1.0.0 (Build 1)`

---

## 6. Directory Structure

```
src/features/settings/
├── index.tsx                    # SettingsScreen component
├── useSettings.ts               # Auth/Payments/Linking logic
└── components/
    ├── index.ts
    ├── SettingsItem.tsx         # Reusable row (label, value, chevron)
    ├── SettingsSection.tsx      # Section header + grouping
    └── VersionInfo.tsx          # Version footer
```

---

## 7. Logic Hook Interface

```typescript
// useSettings.ts
export const useSettings = () => {
  const { user, signInWithApple, signOut, deleteAccount } = useAuth();
  const { restorePurchases, isPro } = usePayments();
  const remoteConfig = useRemoteConfig();

  const handleSignIn = async () => {
    try {
      await signInWithApple();
    } catch (error) {
      Alert.alert('Sign In Failed', 'Could not sign in');
    }
  };

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel' },
      {
        text: 'Sign Out',
        onPress: async () => {
          await signOut();
        },
        style: 'destructive',
      },
    ]);
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Delete Account',
      'Permanently delete? This cannot be undone.',
      [
        { text: 'Cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteAccount();
            Alert.alert('Account Deleted', 'Your account has been deleted.');
          },
          style: 'destructive',
        },
      ]
    );
  };

  const handleRestorePurchases = async () => {
    try {
      await restorePurchases();
      Alert.alert('Success', 'Purchases restored');
    } catch (error) {
      Alert.alert('Failed', error.message);
    }
  };

  const openURL = (url: string) => {
    Linking.openURL(url).catch(() => {
      Alert.alert('Error', 'Could not open URL');
    });
  };

  return {
    user,
    isPro,
    isReviewMode: remoteConfig.isReviewMode,
    handleSignIn,
    handleSignOut,
    handleDeleteAccount,
    handleRestorePurchases,
    openURL,
  };
};
```

---

## 8. Component Interfaces

### **SettingsItem** (Reusable Row)
```typescript
interface SettingsItemProps {
  label: string;                    // "Account ID"
  value?: string;                   // "user-12345"
  onPress: () => void;              // Tap handler
  disabled?: boolean;
  isDangerous?: boolean;            // Red text for destructive actions
}
```

### **SettingsSection** (Group Header)
```typescript
interface SettingsSectionProps {
  title: string;                    // "ACCOUNT"
  children: React.ReactNode;        // SettingsItem elements
}
```

### **VersionInfo** (Footer)
```typescript
interface VersionInfoProps {
  version: string;                  // "1.0.0"
  buildNumber?: string;             // "1"
}
```

---

## 9. User Journey

```
1. User on Main App
   ↓
2. Taps "Settings" button
   ↓
3. SettingsScreen loads
   ↓
4a. View Account Info (tappable)
    ↓
4b. Sign In with Apple (if guest)
    ↓ (Success)
    User data in header

4c. Sign Out (if logged in)
    ↓ (Confirm alert)
    ↓
    User becomes guest

4d. Delete Account (if logged in)
    ↓ (Destructive confirm alert)
    ↓ (Success)
    Account completely deleted
    ↓
    Return to Main (or Onboarding)

5. Tap "Contact Support"
   ↓
   Open email client: mailto:support@example.com

6. Tap "Restore Purchases"
   ↓ (Loading)
   ↓
   Success alert: "Purchases restored"

7. Tap "Privacy Policy" / "Terms"
   ↓
   Open in system browser

8. View Version (v1.0.0 Build 1)
```

---

## 10. Compliance Notes

### **App Store Requirements**
- ✅ Account deletion (immediate)
- ✅ Delete Account button (visible, destructive)
- ✅ Restore Purchases button
- ✅ Privacy Policy link (openable)
- ✅ Terms of Service link (openable)
- ✅ Contact support method

### **Data Handling**
- User data shown (ID, email)
- No sensitive data stored in app
- Deletion is immediate (not background)

---

## 11. Testing Considerations

- [ ] Guest user → Only "Sign In" shown
- [ ] Logged in user → Email, "Sign Out", "Delete" shown
- [ ] Pro user → No upgrade banner
- [ ] Non-Pro → Upgrade banner visible
- [ ] Tap "Sign In" → Apple Sign In dialog (simulator)
- [ ] Tap "Sign Out" → Confirm alert → Sign out works
- [ ] Tap "Delete Account" → Destructive alert → Deletes
- [ ] Tap "Contact Support" → Email client opens
- [ ] Tap "Restore" → Success alert
- [ ] Links open in browser
- [ ] Version footer shows correctly

---

## 12. Future Enhancements

- [ ] Dark mode toggle
- [ ] Notification settings
- [ ] Language preference
- [ ] Account linking (multiple sign-in methods)
- [ ] Two-factor authentication
- [ ] Download data (GDPR)

---

## 📝 Implementation Status

- ✅ Completed with Auth/Payments integration
- ✅ iOS-style grouped sections
- ✅ App Store compliance
- ✅ Proper error handling
- ✅ Alert confirmations for destructive actions

**See**: `src/features/settings/` for implementation.
