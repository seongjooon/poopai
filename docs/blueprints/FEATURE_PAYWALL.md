# Feature Blueprint: Paywall (Pro Access)

**Role**: Expert React Native developer
**Goal**: Convert free users to Pro subscribers using RevenueCat (with mock for development).

---

## 1. Feature Overview

**Location**: `src/features/paywall/`

**One-Liner**: Display subscription options and handle in-app purchases.

**Analogy**: Like Apple's App Store subscription purchase screen.

**User Flow**:
```
Paywall Screen
  ├─ Select Package (Monthly/Annual)
  ├─ Tap "Subscribe"
  │  ├─ iOS: Apple Pay (StoreKit)
  │  └─ Android: Google Play Billing
  └─ Restore Purchases
     → Success → isPro = true → Main App
```

---

## 2. Data & Schema

```typescript
// usePaywall.ts (no separate schema, Mock data structure)
export interface Package {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
}

const MOCK_PACKAGES: Package[] = [
  {
    id: 'monthly',
    name: 'Monthly',
    price: '$9.99',
    period: 'per month',
    isPopular: false,
  },
  {
    id: 'annual',
    name: 'Annual',
    price: '$79.99',
    period: 'per year',
    savings: 'Save 33%',
    isPopular: true,
  },
];
```

---

## 3. Core Dependencies

### **Auth**
- ❌ Does not require user.id

### **Payments**
- ✅ `usePayments().purchasePackage(pkg)`
- ✅ `usePayments().restorePurchases()`
- ✅ `usePayments().isPro` → Check Pro status

### **Remote Config**
- ❌ Not used

### **External APIs**
- ✅ RevenueCat (mocked in Core, real SDK later)

---

## 4. UI States

### **Loading State**
- Show spinner overlay
- Disable purchase button

### **Success State** (Main Paywall)
```
┌──────────────────────────┐
│ [Close] (optional)       │ (top right)
├──────────────────────────┤
│  [Image Placeholder]     │ (200x200)
│                          │
│   Unlock Full Access     │ (Title)
│   Get unlimited access   │ (Subtitle)
├──────────────────────────┤
│  ✓ Feature 1             │ (Benefit list)
│  ✓ Feature 2             │
├──────────────────────────┤
│  ┌────────────────────┐  │ (Package card 1)
│  │ Monthly            │  │
│  │ $9.99 / month      │  │
│  │ [Radio button]     │  │
│  └────────────────────┘  │
│                          │
│  ┌──────────────────────┐│ (Package card 2, "Best Value")
│  │ Annual               ││
│  │ $79.99 / year        ││
│  │ Save 33%             ││ (Savings badge)
│  │ [Radio button]       ││
│  └──────────────────────┘│
├──────────────────────────┤
│  [Subscribe to Annual]   │ (Button, changes with selection)
│  Restore Purchases       │ (Text link)
│  Privacy • Terms         │ (Required links)
│                          │
│  Auto-renewable          │ (Compliance text)
│  Cancel anytime          │
└──────────────────────────┘
```

### **Error State**
- Show alert: "Purchase failed. Please try again."
- User can retry

---

## 5. Feature Screens

### **Paywall Screen**

**Purpose**: Sell Pro subscription

**Layout**:
```
Header
├─ Image placeholder
├─ Title ("Unlock Pro")
└─ Subtitle ("Get unlimited access")

Benefits
├─ Checkmark + Feature 1
├─ Checkmark + Feature 2
└─ Checkmark + Feature 3

Packages (Radio button selection)
├─ Monthly Card
│  ├─ Name, Price, Period
│  ├─ "Auto-renewable. Cancel anytime."
│  └─ Radio button
└─ Annual Card (popular)
   ├─ "Best Value" badge
   ├─ Name, Price, Period
   ├─ "Save 33%" badge
   ├─ "Auto-renewable. Cancel anytime."
   └─ Radio button (preselected)

Footer (Fixed bottom)
├─ Subscribe button (enabled when package selected)
├─ Restore Purchases link
├─ Privacy | Terms links
└─ Compliance text
```

**Interactions**:
- [ ] Tap package card → Select it (radio updates)
- [ ] Tap "Subscribe" → `usePayments().purchasePackage(pkg)`
  - Shows spinner
  - On success: `isPro = true` → Navigate to Main App
  - On error: Show alert
- [ ] Tap "Restore Purchases" → Recover previous purchases
- [ ] Tap "Privacy Policy" / "Terms" → Open in browser
- [ ] Tap close button → Go back

---

## 6. Directory Structure

```
src/features/paywall/
├── index.tsx                    # PaywallScreen component
├── usePaywall.ts                # Purchase logic, mock packages
└── components/
    ├── index.ts
    ├── PackageCard.tsx          # Subscription option card
    └── BenefitList.tsx          # Pro features with checkmarks
```

---

## 7. Logic Hook Interface

```typescript
// usePaywall.ts
export interface Package {
  id: string;
  name: string;
  price: string;
  period: string;
  savings?: string;
  isPopular?: boolean;
}

export const usePaywall = () => {
  const { purchasePackage, restorePurchases, isPro } = usePayments();
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [selectedPackageId, setSelectedPackageId] = useState<string>('annual');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handlePurchase = async (pkg: Package) => {
    setIsPurchasing(true);
    setErrorMessage(null);
    try {
      await purchasePackage(pkg);
      setSelectedPackageId(pkg.id);
    } catch (error: any) {
      if (error?.message !== 'User Cancelled') {
        const message = error?.message || 'Purchase failed.';
        setErrorMessage(message);
        Alert.alert('Purchase Error', message);
      }
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsPurchasing(true);
    try {
      await restorePurchases();
    } catch (error: any) {
      const message = error?.message || 'Restore failed.';
      Alert.alert('Restore Error', message);
    } finally {
      setIsPurchasing(false);
    }
  };

  return {
    packages: MOCK_PACKAGES,
    selectedPackageId,
    isPurchasing,
    errorMessage,
    isPro,
    handlePurchase,
    handleRestore,
  };
};
```

---

## 8. User Journey

```
1. Onboarding last slide → Tap "Get Started"
   ↓
2. Remote config: showPaywallOnboarding = true
   ↓
3. PaywallScreen shows
   ↓
4. User sees benefits list (from config/contents.json)
   ↓
5. Annual package preselected (isPopular = true)
   ↓
6. User taps "Subscribe to Annual"
   ↓
7. App calls usePayments().purchasePackage(annualPackage)
   ├─ Shows spinner
   ├─ iOS: Apple Pay popup
   ├─ Android: Google Play popup
   ↓
8a. Success → isPro = true → Main App
    ↓ (Navigate)

8b. User cancelled → Dismiss alert, stay on Paywall

8c. Error → Show error alert, allow retry

9. Or: Tap "Restore Purchases" → Recover previous subscription
   ↓
   isPro = true → Main App
```

---

## 9. Data Flow

```
Onboarding Last Slide
  ↓ (showPaywallOnboarding?)
PaywallScreen
  ↓ (usePaywall hook)
  ├─ Load MOCK_PACKAGES
  ├─ State: selectedPackageId, isPurchasing, error
  ├─ handlePurchase() → usePayments().purchasePackage()
  └─ handleRestore() → usePayments().restorePurchases()

On Success:
  isPro = true (Zustand state)
  ↓
Main App (from App.tsx condition)
```

---

## 10. Compliance Notes

### **App Store Requirements**
- ✅ "Auto-renewable subscription" text
- ✅ "Cancel anytime from App Store settings" text
- ✅ Privacy Policy link
- ✅ Terms of Service link
- ✅ Restore Purchases button
- ✅ Clear pricing display

### **RevenueCat Integration**
- Benefits: Automatic store management (iOS + Android)
- No extra code needed for Apple Pay / Google Pay
- RevenueCat handles StoreKit / Billing Library

---

## 11. Config Example

```json
{
  "paywall": {
    "title": "Unlock Pro",
    "subtitle": "Get unlimited access",
    "features": [
      "Feature 1",
      "Feature 2",
      "Feature 3"
    ]
  }
}
```

---

## 12. Testing Considerations

- [ ] Initial state: Annual preselected
- [ ] Tap Monthly → Select changes
- [ ] Tap Subscribe → Loading spinner shows
- [ ] Mock purchase succeeds → isPro = true, navigate to Main
- [ ] Tap Restore → Can recover purchased status
- [ ] Links (Privacy, Terms) open in browser
- [ ] Error message displays on failure

---

## 13. Future: Real RevenueCat

Currently: Mock implementation in `src/core/payments/`

To integrate real RevenueCat:
1. Install: `npm install react-native-purchases`
2. Update `usePayments()` in Core
3. Replace `purchasePackage()` with real SDK call
4. No changes needed in Feature (same interface!)

---

## 📝 Implementation Status

- ✅ Completed with mock RevenueCat
- ✅ Full UI with PackageCard and BenefitList
- ✅ Error handling and loading states
- ✅ App Store compliance (links, text)
- ✅ Restore Purchases button

**See**: `src/features/paywall/` for implementation.
