# Feature Blueprint: [Feature Name]

**Role**: Expert React Native developer
**Goal**: Implement [feature goal].

---

## 1. Feature Overview

**Location**: `src/features/[feature_name]/`

**One-Liner**: [What does this feature do in one sentence?]
_Example: "Display a list of user notes with create/edit/delete functionality"_

**Analogy**: [Compare to a popular app]
_Example: "Like Apple Notes but for collaborative teams"_

**User Flow**:
```
[Screen A] → [Action] → [Screen B] → [Completion]
```

---

## 2. Data & Schema

Define the data shape(s) this feature works with.

```typescript
// schema.ts
import { z } from 'zod';

export const ItemSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1).max(100),
  description: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  userId: z.string().uuid(),
});

export type Item = z.infer<typeof ItemSchema>;
```

---

## 3. Core Dependencies

### **Auth**
- [ ] Needs `user.id`?
- [ ] Sign in required?

### **Payments**
- [ ] Pro feature only? (use `useProStatus()`)
- [ ] Show paywall if not Pro?

### **Remote Config**
- [ ] Feature flags? (e.g., `enable_beta_feature`)

### **External APIs**
- [ ] Supabase DB?
- [ ] OpenAI API?
- [ ] REST endpoints?

### **Storage**
- [ ] AsyncStorage for local data?
- [ ] Persistent cache?

---

## 4. UI States

Describe what the screen shows in each state.

### **Empty State**
_What to show when no data exists?_

- Visual: [Icon/Illustration]
- Copy: [Message text]
- CTA: [Button text]
- Example: "No notes yet. Press + to create your first note."

### **Loading State**
_Show while fetching data._

- [ ] Full screen spinner
- [ ] Skeleton loaders
- [ ] Shimmer animation
- Design: [Description]

### **Success State**
_Main screen with data displayed._

- List view / Detail view / Grid view?
- Interactive elements (tap, swipe, long-press)?
- Floating action button?
- Example: "List of notes with swipe-to-delete"

### **Error State**
_What to show if request fails._

- [ ] Toast notification
- [ ] Inline error message
- [ ] Full screen error with retry
- Copy: [Error message text]

---

## 5. Feature Screens

### **Screen 1: [Screen Name]**

**Purpose**: [What does user accomplish here?]

**Layout**:
```
┌─────────────────────┐
│ [Header]            │  (Navigation, title)
├─────────────────────┤
│                     │
│ [Content]           │  (List, form, detail)
│                     │
├─────────────────────┤
│ [Footer/CTA]        │  (Buttons, actions)
└─────────────────────┘
```

**Interactions**:
- [ ] Tap item → Go to detail screen
- [ ] Long press → Delete option
- [ ] Swipe → Edit/delete action
- [ ] Pull-to-refresh → Reload data

**Components Used**:
- Button (from @src/ui/atoms)
- Typography (from @src/ui/atoms)
- Card (from @src/ui/molecules)
- Custom: [FeatureItem, FeatureList]

---

## 6. Directory Structure

```
src/features/[feature_name]/
├── index.tsx                    # Entry point (main screen)
├── schema.ts                    # Zod data validation
├── use[Feature].ts              # Logic hook (mutations/queries)
├── components/
│   ├── index.ts                 # Export all
│   ├── [Feature]Item.tsx         # List item component
│   ├── [Feature]Detail.tsx       # Detail screen
│   └── [Feature]Form.tsx         # Create/edit form
├── hooks/
│   └── useFeatureData.ts         # Query hook (if needed)
└── utils/
    └── helpers.ts               # Pure functions (validators, formatters)
```

---

## 7. Logic Hook Interface

Define what `use[Feature]()` should return.

```typescript
// use[Feature].ts
export const use[Feature] = () => {
  // State
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Queries
  const fetchItems = async () => { /* ... */ };

  // Mutations
  const createItem = async (data: CreateItemInput) => { /* ... */ };
  const updateItem = async (id: string, data: UpdateItemInput) => { /* ... */ };
  const deleteItem = async (id: string) => { /* ... */ };

  return {
    // State
    items,
    loading,
    error,
    selectedId,

    // Actions
    fetchItems,
    createItem,
    updateItem,
    deleteItem,
    setSelectedId,
  };
};
```

---

## 8. Example User Journey

```
1. User sees empty state
   ↓
2. Taps "+" button → [Create Screen]
   ↓
3. Fills form → Taps "Save"
   ↓
4. Returns to list → Item appears (success toast)
   ↓
5. Taps item → [Detail Screen]
   ↓
6. Taps edit → Modifies data → Saves
   ↓
7. Returns to list (data updated)
   ↓
8. Swipes item → Taps delete → Confirm dialog
   ↓
9. Item removed from list
```

---

## 9. Pro Feature Considerations

_If this is a Pro-only feature:_

- [ ] Check `useProStatus()` on mount
- [ ] Show paywall if user is not Pro
- [ ] Track feature usage in analytics
- [ ] Offer free trial or limited access?

---

## 10. Localization & Copy

All text should come from `config/contents.json`:

```json
{
  "[feature_name]": {
    "title": "Notes",
    "emptyState": "No notes yet",
    "createButton": "Add Note",
    "deleteConfirm": "Delete this note?"
  }
}
```

---

## 11. Testing Considerations

- [ ] Test empty state
- [ ] Test loading state
- [ ] Test error handling
- [ ] Test CRUD operations
- [ ] Test offline mode (AsyncStorage)
- [ ] Test navigation flow

---

## 12. Additional Notes

_Any special requirements, edge cases, or decisions?_

---

## 🚀 Execution Checklist for Claude

- [ ] Read schema.ts and validate data model
- [ ] Create mock data for development
- [ ] Build components in `components/`
- [ ] Implement `use[Feature].ts` logic
- [ ] Assemble `index.tsx`
- [ ] Add to App.tsx navigation
- [ ] Test on simulator

---

**Once filled out, paste this entire document to Claude with**: _"Implement this feature"_
