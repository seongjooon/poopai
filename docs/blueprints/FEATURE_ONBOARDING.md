# Feature Blueprint: Onboarding Flow

**Role**: Expert React Native developer
**Goal**: Welcome new users and introduce app features before accessing main app or paywall.

---

## 1. Feature Overview

**Location**: `src/features/onboarding/`

**One-Liner**: Display slide-based onboarding tutorial and persist completion status.

**Analogy**: Like Instagram's onboarding swipeable carousel introducing features.

**User Flow**:
```
App Start → Check AsyncStorage →
  ├─ Completed? → Skip to Main App
  └─ Not completed? → Show Onboarding
                       ↓ (Swipe/Next)
                     Last slide?
                       ├─ NO → Next slide
                       └─ YES → Check paywall_onboarding_show
                                ├─ YES → Paywall
                                └─ NO → Main App (mark completed)
```

---

## 2. Data & Schema

```typescript
// schema.ts
import { z } from 'zod';

export const OnboardingStepSchema = z.object({
  id: z.string(),
  title: z.string(),
  subtitle: z.string(),
});

export type OnboardingStep = z.infer<typeof OnboardingStepSchema>;

export const OnboardingContentSchema = z.object({
  onboarding: z.array(OnboardingStepSchema),
});
```

**Data Source**: `config/contents.json`
```json
{
  "onboarding": [
    {
      "id": "welcome",
      "title": "Welcome to App",
      "subtitle": "The best app for your needs."
    },
    {
      "id": "feature2",
      "title": "Feature Title",
      "subtitle": "Feature description."
    }
  ]
}
```

---

## 3. Core Dependencies

### **Auth**
- ❌ Does not need user.id
- ❌ Not required to be signed in

### **Payments**
- ❌ Not a Pro feature

### **Remote Config**
- ✅ `useRemoteConfig().showPaywallOnboarding` → Decide Paywall entry

### **Storage**
- ✅ `AsyncStorage` → Store `onboarding_completed` key

---

## 4. UI States

### **Empty State** (First Launch)
- Show first slide
- "Next" button visible
- Skip button visible (top right)

### **Loading State**
- N/A (data loaded from JSON synchronously)

### **Success State** (Slides Displayed)
```
┌──────────────────────────┐
│ [Skip] (top right)       │
├──────────────────────────┤
│                          │
│  [Image Placeholder]     │ (200x200, gray)
│                          │
│   Welcome to App         │ (Title)
│   Best for your needs.   │ (Subtitle)
│                          │
├──────────────────────────┤
│  ● ○ ○                   │ (Dot indicator)
├──────────────────────────┤
│     [Next Button]        │ (or "Get Started" on last)
└──────────────────────────┘
```

### **Error State**
- N/A (simple JSON parsing, Zod handles errors)

---

## 5. Feature Screens

### **Onboarding Carousel**

**Purpose**: Introduce app and decide next step (Paywall or Main App)

**Layout**:
```
┌─────────────────────┐
│ [Skip]              │ (text button, top right)
├─────────────────────┤
│   [Slide Content]   │ (Centered)
│   - Image           │ (placeholder)
│   - Title           │ (H1)
│   - Subtitle        │ (Body)
├─────────────────────┤
│   ● ○ ○ ○           │ (Dot indicator, current slide highlighted)
├─────────────────────┤
│  [Next / Get Started]│ (Button, changes text on last slide)
└─────────────────────┘
```

**Interactions**:
- [ ] Swipe left → Next slide
- [ ] Tap "Next" → Next slide
- [ ] Tap "Skip" → Mark completed + Go to Main App
- [ ] Last slide + "Get Started" → Check paywall flag
  - If true → Go to Paywall
  - If false → Mark completed + Go to Main App

---

## 6. Directory Structure

```
src/features/onboarding/
├── index.tsx                    # OnboardingScreen component
├── schema.ts                    # Zod validation (OnboardingStep)
├── useOnboarding.ts             # Logic: step management, navigation
└── components/
    ├── index.ts
    ├── Slide.tsx                # Single slide display (title, subtitle, image)
    └── DotIndicator.tsx         # Progress dots (● ○ ○)
```

---

## 7. Logic Hook Interface

```typescript
// useOnboarding.ts
export const useOnboarding = (
  onNavigateToPaywall: () => void,
  onNavigateToMain: () => void
) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const remoteConfig = useRemoteConfig();
  const steps = contents.onboarding.map(step => OnboardingStepSchema.parse(step));

  const isLastStep = currentStepIndex === steps.length - 1;

  const handleNext = async () => {
    if (!isLastStep) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      // Last step
      if (remoteConfig.showPaywallOnboarding) {
        onNavigateToPaywall();
      } else {
        await AsyncStorage.setItem('onboarding_completed', 'true');
        onNavigateToMain();
      }
    }
  };

  const skipOnboarding = async () => {
    await AsyncStorage.setItem('onboarding_completed', 'true');
    onNavigateToMain();
  };

  return {
    steps,
    currentStepIndex,
    currentStep: steps[currentStepIndex],
    isLastStep,
    isLoading,
    handleNext,
    skipOnboarding,
  };
};
```

---

## 8. User Journey

```
1. App starts for first time
   ↓
2. App.tsx checks AsyncStorage.getItem('onboarding_completed')
   ↓
3. Not found → Show OnboardingScreen
   ↓
4. User sees first slide (Welcome)
   ↓
5a. Tap "Next" → Show slide 2
   (repeat for all slides)
   ↓
5b. Or tap "Skip" → Mark completed + Main App
   ↓
6. Last slide shown
   ↓
7. Tap "Get Started"
   ↓
8. App checks useRemoteConfig().showPaywallOnboarding
   ├─ YES → PaywallScreen
   │         ↓ (User purchases or restores)
   │         → Main App
   └─ NO → AsyncStorage mark + Main App
```

---

## 9. Data Flow

```
App.tsx
  ↓
[Check AsyncStorage]
  ↓
No 'onboarding_completed'?
  ↓
<OnboardingScreen onNavigateToPaywall={} onNavigateToMain={} />
  ↓
useOnboarding()
  ├─ Load contents.onboarding from JSON
  ├─ Validate with Zod
  ├─ Track currentStepIndex
  └─ Handle navigation on completion
```

---

## 10. Compliance Notes

- ✅ Data persisted (won't show again after completion)
- ✅ Skip option available (user preference)
- ✅ Remote config controls Paywall entry (A/B testing ready)

---

## 11. Config Example

```json
{
  "onboarding": [
    {
      "id": "welcome",
      "title": "Welcome to App",
      "subtitle": "The best app for your needs."
    }
  ]
}
```

Add more slides by adding objects to the array.

---

## 12. Testing Considerations

- [ ] First launch → Onboarding shows
- [ ] Tap Skip → Completes, Main App shows
- [ ] Tap Next → Moves to next slide
- [ ] Last slide + Get Started → Checks paywall flag
- [ ] App restart → Onboarding doesn't show (data persisted)
- [ ] Delete AsyncStorage → Onboarding shows again

---

## 📝 Implementation Status

- ✅ Completed and tested
- ✅ Zod schema validation
- ✅ AsyncStorage persistence
- ✅ Remote config integration
- ✅ Paywall decision logic

**See**: `src/features/onboarding/` for implementation.
