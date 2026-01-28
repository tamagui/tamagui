# Takeout Pro Pricing Simplification & Code Reorganization Plan

## Overview

This plan covers:
1. Simplifying the purchase modal UI (keep FAQ tab, add support toggle)
2. Reorganizing all purchase/pro code into `features/pro/`
3. Separating Stripe dependencies so overview modal loads fast
4. Cleaning up redundant stores and consolidating logic

---

## Part 1: UI Changes

### 1.1 Promo Text Update
**File:** `promoConfig.ts`
```diff
- description: 'for launch month',
+ description: 'during Takeout 2 beta',
```

### 1.2 Support Tiers (New Structure)

| Tier | Name | Price | SLA | Description |
|------|------|-------|-----|-------------|
| `chat` | Chat | Included | None | Community chat room access, no SLA guarantee |
| `direct` | Direct | $500/mo | 2 business days | 5 bug fixes/year, 2 business day response, fixes prioritized |
| `sponsor` | Sponsor | $2,000/mo | 1 day | Unlimited priority fixes, 1 day response, monthly video call |

**Base plan explicitly has NO support** - just chat access to community room.

### 1.3 Simplified Purchase Modal (Keep 2 Tabs: Pro | FAQ)

**Remove:** Support tab
**Add:** ToggleGroup for support selection inline on Pro tab

```
┌─────────────────────────────────────────────────┐
│                                          [X]    │
│  ┌──────────────────┬───────────────────┐      │
│  │       Pro        │        FAQ        │      │
│  └──────────────────┴───────────────────┘      │
│                                                 │
│  The best cross-platform React + RN stack      │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │3 Stacks  │ │ Bento    │ │ 1 Year   │       │
│  │Takeout   │ │ Pro      │ │ Updates  │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │Unlimited │ │ Discord  │ │ Lifetime │       │
│  │Team      │ │ Chat     │ │ Rights   │       │
│  └──────────┘ └──────────┘ └──────────┘       │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ • Per-project license (web + iOS + Android) │
│  │ • After 1 year: $300/year for updates   │   │
│  │ • Buy multiple projects anytime         │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Support Level                                  │
│  ┌────────┬────────┬──────────┐               │
│  │  Chat  │ Direct │ Sponsor  │               │
│  │ incl.  │$500/mo │$2,000/mo │               │
│  └────────┴────────┴──────────┘               │
│  [Selected tier description appears here]      │
│                                                 │
│  ─────────────────────────────────────────────  │
│  $̶9̶9̶9̶ $499 one-time        [ Checkout → ]    │
│  50% off! during Takeout 2 beta                │
│                                                 │
│  For companies with >$1M revenue, contact us   │
│  for enterprise pricing: support@tamagui.dev   │
│                                                 │
│  [License] [Policies]         [Stripe logo]   │
└─────────────────────────────────────────────────┘
```

### 1.4 FAQ Updates (Ask first)

**Proposed new questions:**

1. **Can I buy licenses for multiple projects?**
   > Yes! Each license covers one project (web domain + iOS + Android apps). You can purchase additional project licenses anytime. Update subscriptions are always $300/year per project regardless of when you buy.

2. **What's the difference between support levels?**
   > **Chat (Included):** Access to the private #takeout Discord channel. No SLA guarantee.
   > **Direct ($500/mo):** 5 bug fixes per year, guaranteed response within 2 business days, your issues get prioritized.
   > **Sponsor ($2,000/mo):** Unlimited top-priority bug fixes, 1 day response time, plus a monthly video call.

3. **What about companies with significant revenue?**
   > Companies with over $1M in annual revenue should contact us at support@tamagui.dev for enterprise pricing. The standard license is intended for bootstrapped companies, solo developers, and early-stage startups.

4. **What support do I get in the base plan?** (UPDATE existing)
   > The base plan includes access to the private #takeout Discord channel. We prioritize responses there over the public Discord, but there is no guaranteed SLA. For guaranteed response times and bug fix commitments, see our Direct and Sponsor support tiers.

---

## Part 2: Code Reorganization

### Current Structure (Messy)

```
features/
├── site/purchase/           # 21 files, all mixed together
│   ├── *ModalStore.ts       # 5 store files
│   ├── *Modal.tsx           # 5 modal components
│   ├── Stripe*.tsx          # Stripe-dependent
│   ├── *.tsx                # UI utilities
│   └── *.ts                 # Hooks, config
└── stripe/                  # 4 files, backend config
    ├── products.ts
    ├── stripe.ts
    ├── tiers.ts             # Legacy/unused?
    └── types.ts
```

### Target Structure (Clean)

```
features/
└── pro/
    ├── index.ts                    # Public exports
    │
    ├── stores/
    │   ├── index.ts                # Re-exports all stores
    │   ├── purchaseModal.ts        # Overview modal state
    │   ├── checkoutModal.ts        # Payment modal state (renamed from paymentModal)
    │   ├── accountModal.ts         # Account modal state
    │   ├── teamModal.ts            # Team member modal state
    │   └── takeout.ts              # Takeout-specific state
    │
    ├── config/
    │   ├── index.ts
    │   ├── promo.ts                # Promo config
    │   ├── products.ts             # Stripe product IDs (from features/stripe/)
    │   ├── tiers.ts                # Support tier definitions (NEW)
    │   └── constants.ts            # V2_LICENSE_PRICE, etc.
    │
    ├── hooks/
    │   ├── index.ts
    │   ├── useSubscriptionModal.ts
    │   ├── useProducts.ts
    │   └── useTeamSeats.ts
    │
    ├── components/
    │   ├── index.ts
    │   ├── PurchaseButton.tsx      # From helpers.tsx
    │   ├── PoweredByStripe.tsx
    │   ├── FeatureGrid.tsx         # NEW - grid of included features
    │   ├── SupportTierToggle.tsx   # NEW - the ToggleGroup
    │   ├── PricingDisplay.tsx      # NEW - price with promo
    │   └── FundingNotice.tsx       # NEW - "contact us for enterprise"
    │
    ├── modals/
    │   ├── index.ts                # Lazy exports
    │   │
    │   ├── purchase/               # The overview modal (NO STRIPE JS)
    │   │   ├── PurchaseModal.tsx   # Main modal shell
    │   │   ├── ProTab.tsx          # Features + support toggle
    │   │   └── FaqTab.tsx          # FAQ content
    │   │
    │   ├── checkout/               # Payment modal (HAS STRIPE JS)
    │   │   ├── CheckoutModal.tsx   # Lazy-loaded, contains Stripe Elements
    │   │   ├── PaymentForm.tsx     # The actual form
    │   │   └── OrderSummary.tsx    # Right-side summary
    │   │
    │   ├── account/                # Account dashboard
    │   │   ├── AccountModal.tsx
    │   │   ├── PlanTab.tsx
    │   │   ├── UpgradeTab.tsx      # Support tier changes
    │   │   ├── ManageTab.tsx
    │   │   ├── TeamTab.tsx
    │   │   └── DiscordPanel.tsx
    │   │
    │   └── shared/                 # Shared modal pieces
    │       ├── AgreementModal.tsx
    │       ├── PoliciesModal.tsx
    │       └── FaqContent.tsx      # Reusable FAQ
    │
    ├── utils/
    │   ├── index.ts
    │   ├── getProductInfo.ts
    │   └── calculatePrice.ts
    │
    └── types.ts                    # All TypeScript types
```

### Key Architectural Changes

#### 2.1 Separate Stripe JS from Overview Modal

**Current:** `NewPurchaseModal.tsx` lazy-imports `StripePaymentModal.tsx`
**Problem:** Still loads some Stripe types/deps at import time

**New Architecture:**
```tsx
// features/pro/modals/purchase/PurchaseModal.tsx
// NO Stripe imports at all - just UI + stores

const CheckoutModal = lazy(() => import('../checkout/CheckoutModal'))

export function PurchaseModal() {
  const store = usePurchaseStore()
  const [checkoutOpen, setCheckoutOpen] = useState(false)

  return (
    <>
      <Dialog open={store.show}>
        {/* Pure UI - feature grid, toggles, pricing */}
        <Button onPress={() => setCheckoutOpen(true)}>Checkout</Button>
      </Dialog>

      {/*
        Key pattern: Mount CheckoutModal when purchase modal opens (not on checkout click)
        This starts lazy-loading Stripe JS in background while user browses.
        By the time they click "Checkout", Stripe is already loaded and ready.
      */}
      {store.show && (
        <Suspense fallback={null}>
          <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
        </Suspense>
      )}
    </>
  )
}
```

```tsx
// features/pro/modals/checkout/CheckoutModal.tsx
// ALL Stripe deps isolated here - loaded when purchase modal opens
import { Elements, PaymentElement } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'

type Props = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CheckoutModal({ open, onOpenChange }: Props) {
  // This file contains all Stripe JS
  // By the time this renders, Stripe is already loading in background
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* Stripe Elements, PaymentForm, etc */}
    </Dialog>
  )
}
```

**Benefits:**
1. Stripe JS starts loading as soon as purchase modal opens
2. User browses features/FAQ while Stripe loads in background
3. When they click "Checkout", Stripe is already ready - no wait
4. If user never clicks checkout, Stripe still loaded but that's fine (they opened modal = intent to buy)

#### 2.2 Consolidate Stores

**Current:** Two nearly identical stores
- `purchaseModalStore.ts` - has `show`, pricing fields, promo fields
- `paymentModalStore.ts` - has `show`, pricing fields, promo fields, V2 fields

**New:** Single source of truth with clear separation
```tsx
// features/pro/stores/purchaseModal.ts
class PurchaseStore {
  // Overview modal state
  show = false
  tab: 'pro' | 'faq' = 'pro'

  // Selection state (shared with checkout)
  supportTier: 'chat' | 'direct' | 'sponsor' = 'chat'

  // Promo state
  activePromo: PromoConfig | null = null
  prefilledCouponCode: string | null = null
}

// features/pro/stores/checkoutModal.ts
class CheckoutStore {
  show = false

  // V2 project info (collected at checkout)
  projectName = ''
  projectDomain = ''

  // Payment state
  isProcessing = false
  error: Error | null = null
}
```

#### 2.3 Move Stripe Product Config

**Current:** `features/stripe/products.ts` contains product IDs
**New:** Move to `features/pro/config/products.ts` (keep stripe backend client separate)

```
features/
├── pro/config/products.ts    # Product IDs, tier prices, etc.
└── stripe/stripe.ts          # Just the backend Stripe client init
```

---

## Part 3: Implementation Order

### Phase 1: UI Changes (Can deploy independently)
1. ✅ Update promo text in `promoConfig.ts`
2. ✅ Add new FAQ content to `FaqTabContent.tsx`
3. ✅ Simplify NewPurchaseModal (remove Support tab, add ToggleGroup)
4. ✅ Update support tier values throughout
5. ✅ Add funding threshold notice

### Phase 2: Code Reorganization
1. Create `features/pro/` directory structure
2. Move stores with deprecation re-exports from old location
3. Move config files
4. Move hooks
5. Split modals into new structure
6. Update all imports across site
7. Remove old files once all imports updated

### Phase 3: Stripe Separation
1. Create new `CheckoutModal` with all Stripe deps
2. Update `PurchaseModal` to lazy-load it
3. Test that Stripe JS only loads at checkout time
4. Remove Stripe deps from overview modal file

### Phase 4: Stripe Backend (Later/Manual)
1. Create new Stripe products for support tiers ($500, $2000)
2. Update API endpoints
3. Deprecate old support tier products ($800, $1600, $2400)

---

## Part 4: Logged-in User Support Management

When user is logged in and wants to change support tier:

**Simple flow:**
1. User goes to Account modal → Upgrade tab
2. Sees current tier + new ToggleGroup with tiers
3. Selects new tier
4. Clicks "Update Support"
5. Goes through Checkout modal (Stripe handles proration)
6. Confirmation

**No fancy UI needed** - reuse the same CheckoutModal, just with different parameters.

---

## Questions Before Proceeding

1. **FAQ content** - should I show you the proposed FAQ updates before implementing?

2. **Funding threshold** - confirmed $1M revenue. Should this be:
   - In the modal UI (small note at bottom)
   - Only in FAQ
   - Both

3. **Support tier names** - `Chat | Direct | Sponsor` good? Or prefer:
   - `Community | Priority | Dedicated`
   - `Basic | Pro | Enterprise`

4. **Code reorg timing** - do you want:
   - Phase 1 only first (just UI changes)
   - Everything at once
   - Phase 1 + 2 together, Phase 3 later

---

## Files to Create/Modify Summary

### Create (Phase 2+):
```
features/pro/
├── index.ts
├── stores/index.ts
├── stores/purchaseModal.ts
├── stores/checkoutModal.ts
├── stores/accountModal.ts
├── stores/teamModal.ts
├── stores/takeout.ts
├── config/index.ts
├── config/promo.ts
├── config/products.ts
├── config/tiers.ts
├── config/constants.ts
├── hooks/index.ts
├── hooks/useSubscriptionModal.ts
├── hooks/useProducts.ts
├── hooks/useTeamSeats.ts
├── components/index.ts
├── components/FeatureGrid.tsx
├── components/SupportTierToggle.tsx
├── components/PricingDisplay.tsx
├── components/FundingNotice.tsx
├── modals/index.ts
├── modals/purchase/PurchaseModal.tsx
├── modals/purchase/ProTab.tsx
├── modals/purchase/FaqTab.tsx
├── modals/checkout/CheckoutModal.tsx
├── modals/checkout/PaymentForm.tsx
├── modals/checkout/OrderSummary.tsx
├── modals/account/AccountModal.tsx
├── modals/account/PlanTab.tsx
├── modals/account/UpgradeTab.tsx
├── modals/account/ManageTab.tsx
├── modals/account/TeamTab.tsx
├── modals/account/DiscordPanel.tsx
├── modals/shared/AgreementModal.tsx
├── modals/shared/PoliciesModal.tsx
├── modals/shared/FaqContent.tsx
├── utils/index.ts
├── utils/getProductInfo.ts
├── utils/calculatePrice.ts
└── types.ts
```

### Modify:
- `app/(site)/_layout.tsx` - Update imports
- All files importing from `features/site/purchase/`

### Delete (after migration):
- `features/site/purchase/` (entire directory)
- `features/stripe/tiers.ts` (if unused)

---

## Part 5: UI Patterns & Style Guide

Based on analysis of 10+ files across the tamagui.dev codebase, these are the patterns to follow:

### Layout Patterns

#### Containers
```tsx
// Use YStack for vertical layouts, XStack for horizontal
<YStack gap="$4" p="$6">
  <XStack gap="$3" items="center" justify="space-between">
```

#### Responsive Breakpoints
```tsx
$sm       // small
$gtSm     // > 768px
$gtMd     // > 1024px
$gtLg     // > 1280px
$maxMd    // max-width 1024px (for mobile sheets)

// Usage
$gtMd={{ p: '$8', gap: '$6' }}
$maxMd={{ flexDirection: 'column' }}
```

#### Modal Pattern (Dialog + Sheet Adapt)
```tsx
<Dialog modal open={store.show} onOpenChange={val => store.show = val}>
  <Dialog.Adapt when="maxMd">
    <Sheet modal transition="quick">
      <Sheet.Frame bg="$color1" p={0}>
        <Sheet.ScrollView>
          <Dialog.Adapt.Contents />
        </Sheet.ScrollView>
      </Sheet.Frame>
      <Sheet.Overlay bg="$shadow4" />
    </Sheet>
  </Dialog.Adapt>

  <Dialog.Portal zIndex={1_000_000}>
    <Dialog.Overlay backdropFilter="blur(35px)" bg="$shadow2" />
    <Dialog.Content bordered elevate width="90%" maxW={900} p={0}>
      {/* content */}
    </Dialog.Content>
  </Dialog.Portal>
</Dialog>
```

#### Tab Pattern
```tsx
<Tabs
  flex={1}
  value={currentTab}
  onValueChange={setCurrentTab}
  orientation="horizontal"
  flexDirection="column"
>
  <Tabs.List>
    <YStack width="50%" flex={1}>
      <Tabs.Tab value="pro" unstyled items="center" justify="center" height={60}>
        <Paragraph fontFamily="$mono" size="$7">Pro</Paragraph>
      </Tabs.Tab>
    </YStack>
    {/* more tabs... */}
  </Tabs.List>

  <Tabs.Content value={currentTab} forceMount flex={1} minH={550}>
    {/* content */}
  </Tabs.Content>
</Tabs>
```

### Typography Patterns

```tsx
// Headers
<H3 fontFamily="$mono" size="$6">Section Title</H3>

// Body text (muted)
<Paragraph color="$color10" size="$4">Description text</Paragraph>

// Body text (strong)
<Paragraph color="$color11" size="$5">Important text</Paragraph>

// Small text
<SizableText size="$2" color="$color9">Fine print</SizableText>

// Price display
<H3 size="$11" letterSpacing={-2}>$499</H3>
```

### Color & Theme Patterns

```tsx
// Semantic colors
$color1      // lightest background
$color3      // panel/card backgrounds
$color9-10   // muted text
$color11-12  // strong text
$borderColor // borders

// Theme wrapping for semantic colors
<Theme name="accent">   {/* primary actions */}
<Theme name="yellow">   {/* warnings */}
<Theme name="green">    {/* success */}
<Theme name="red">      {/* errors/destructive */}
```

### Card Pattern

```tsx
<YStack
  borderWidth={1}
  borderColor="$color3"
  rounded="$4"
  p="$4"
  gap="$3"
  bg="$color1"
  hoverStyle={{ bg: '$color2' }}
>
  <H3 fontFamily="$mono" size="$6">{title}</H3>
  <Paragraph color="$color10">{description}</Paragraph>
</YStack>
```

### Feature Grid Pattern (for "What's Included")

```tsx
<XStack flexWrap="wrap" gap="$3" items="center" justify="center">
  {features.map(feature => (
    <YStack
      key={feature.id}
      borderWidth={1}
      borderColor="$color4"
      rounded="$4"
      p="$3"
      width={140}
      items="center"
      gap="$2"
    >
      <feature.icon size={24} color="$color11" />
      <Paragraph size="$3" text="center">{feature.label}</Paragraph>
    </YStack>
  ))}
</XStack>
```

### Button Patterns

```tsx
// Primary action
<Theme name="accent">
  <Button rounded="$10" size="$4">
    <Button.Text fontFamily="$mono">Checkout</Button.Text>
  </Button>
</Theme>

// Secondary/text button
<SizableText
  color="$color10"
  cursor="pointer"
  textDecorationLine="underline"
  hoverStyle={{ color: '$color11' }}
  size="$2"
  onPress={handlePress}
>
  License
</SizableText>
```

### ToggleGroup Pattern (for Support Tiers)

```tsx
<ToggleGroup
  type="single"
  value={supportTier}
  onValueChange={setSupportTier}
  orientation="horizontal"
>
  <ToggleGroup.Item value="chat" flex={1}>
    <YStack items="center" gap="$1" p="$3">
      <Paragraph fontWeight="600">Chat</Paragraph>
      <Paragraph size="$2" color="$color9">included</Paragraph>
    </YStack>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="direct" flex={1}>
    <YStack items="center" gap="$1" p="$3">
      <Paragraph fontWeight="600">Direct</Paragraph>
      <Paragraph size="$2" color="$color9">$500/mo</Paragraph>
    </YStack>
  </ToggleGroup.Item>
  <ToggleGroup.Item value="sponsor" flex={1}>
    <YStack items="center" gap="$1" p="$3">
      <Paragraph fontWeight="600">Sponsor</Paragraph>
      <Paragraph size="$2" color="$color9">$2,000/mo</Paragraph>
    </YStack>
  </ToggleGroup.Item>
</ToggleGroup>
```

### Animation Patterns

```tsx
// Dialog/Sheet animations
transition="quick"
enterStyle={{ y: -10, opacity: 0, scale: 0.975 }}
exitStyle={{ y: 10, opacity: 0, scale: 0.975 }}

// Hover states
hoverStyle={{ bg: '$backgroundHover', y: -2 }}
pressStyle={{ bg: '$backgroundPress', y: 0 }}

// CSS transition classes
className="transition all ease-in ms100"
```

### Spacing Tokens

```
$1   = 4px   (tiny)
$2   = 8px   (small gaps)
$3   = 12px  (common gaps)
$4   = 16px  (standard padding/gaps)
$5   = 20px  (medium)
$6   = 24px  (section padding)
$8   = 32px  (large)
$10  = 40px  (section separators)
```

### Notice/Alert Pattern

```tsx
<Theme name="yellow">
  <XStack
    bg="$color3"
    rounded="$4"
    borderWidth={0.5}
    borderColor="$color8"
    p="$3"
  >
    <Paragraph size="$3" color="$color11">
      For companies with over $1M in annual revenue,{' '}
      <Link href="mailto:support@tamagui.dev">contact us</Link>
      {' '}for enterprise pricing.
    </Paragraph>
  </XStack>
</Theme>
```

### Price Display with Promo

```tsx
<XStack items="baseline" gap="$2">
  {activePromo && (
    <H3
      size="$10"
      fontWeight="200"
      opacity={0.5}
      textDecorationLine="line-through"
      color="$green10"
    >
      ${originalPrice.toLocaleString()}
    </H3>
  )}
  <H3 size="$11" letterSpacing={-2}>
    ${discountedPrice.toLocaleString()}
  </H3>
</XStack>
<Paragraph color="$color9" size="$3">
  {activePromo?.label}! {subscriptionMessage}
</Paragraph>
```

### Lazy Loading Pattern

```tsx
const CheckoutModal = lazy(() => import('../checkout/CheckoutModal'))

// In component:
{store.show && (
  <Suspense fallback={null}>
    <CheckoutModal open={checkoutOpen} onOpenChange={setCheckoutOpen} />
  </Suspense>
)}
```

### Store Pattern

```tsx
// Definition
class PurchaseStore {
  show = false
  supportTier: 'chat' | 'direct' | 'sponsor' = 'chat'
  activePromo: PromoConfig | null = null
}

export const purchaseStore = createStore(PurchaseStore)
export const usePurchaseStore = createUseStore(PurchaseStore)

// Usage
const store = usePurchaseStore()
store.show = true
store.supportTier = 'direct'
```
