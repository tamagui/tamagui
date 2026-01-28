# Takeout Pro Pricing Simplification Plan

## Overview

This plan simplifies the Takeout Pro purchase modal from a 3-tab structure to a single streamlined screen with:
- Feature grid
- Key licensing details
- Support tier toggle (Chat | Direct | Sponsor)
- FAQ updates
- Funding threshold limitation ($500k)

---

## Current State Analysis

### Files to Modify:
1. **`code/tamagui.dev/features/site/purchase/promoConfig.ts`** - Change "for launch month" to "during Takeout 2 beta"
2. **`code/tamagui.dev/features/site/purchase/NewPurchaseModal.tsx`** - Major refactor (remove tabs, add support toggle)
3. **`code/tamagui.dev/features/site/purchase/FaqTabContent.tsx`** - Add new FAQ items
4. **`code/tamagui.dev/features/site/purchase/NewAccountModal.tsx`** - Add support tier management for logged-in users
5. **`code/tamagui.dev/features/site/purchase/purchaseModalStore.ts`** - Update store to handle support tiers

### Current Support Tiers (to be replaced):
```typescript
// Current (NewPurchaseModal.tsx:537-542)
const tiers = [
  { value: '0', label: 'None', price: 0 },
  { value: '1', label: 'Tier 1', price: 800 },
  { value: '2', label: 'Tier 2', price: 1600 },
  { value: '3', label: 'Tier 3', price: 2400 },
]
```

---

## New Support Tiers

| Tier | Name | Price | SLA | Description |
|------|------|-------|-----|-------------|
| `chat` | Chat | Included ($0) | None | Access to community chat room, no SLA guarantee |
| `direct` | Direct | $500/mo | 2 business days | 5 bug fixes/year, response within 2 business days, fixes prioritized |
| `sponsor` | Sponsor | $2,000/mo | 1 day | Unlimited top priority fixes, 1 day response, 1 video chat/month |

---

## Changes Detail

### 1. promoConfig.ts
```diff
  {
    id: 'tko2-launch',
    code: 'TKO2',
    couponId: 'ULFkuEYE',
    label: '50% off',
-   description: 'for launch month',
+   description: 'during Takeout 2 beta',
    percentOff: 50,
    active: true,
    theme: 'green',
  },
```

### 2. NewPurchaseModal.tsx - Simplified Single Screen

**Remove:**
- Tabs component (`purchase`, `support`, `faq`)
- `SupportTabContent` component (replaced with ToggleGroup)
- Complex tab navigation logic

**Add:**
- Feature grid (using XStack/YStack)
- ToggleGroup for support selection: `[ Chat | Direct | Sponsor ]`
- Key licensing info section
- Funding threshold notice (small note)
- Inline FAQ accordion or link to FAQ

**New Structure:**
```
┌─────────────────────────────────────────────────┐
│ [X]                                             │
│                                                 │
│  Tamagui Pro                                    │
│                                                 │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ 3 Stacks │ │ Bento    │ │ Updates  │        │
│  │          │ │ Pro      │ │ 1 Year   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │ Unlimited│ │ Discord  │ │ Lifetime │        │
│  │ Team     │ │ Channel  │ │ Rights   │        │
│  └──────────┘ └──────────┘ └──────────┘        │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │ License: Per-project (web + iOS + Android) │
│  │ After 1 year: $300/year for updates     │   │
│  │ Buy multiple projects anytime           │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Support Level                                  │
│  ┌────────┬────────┬──────────┐               │
│  │  Chat  │ Direct │ Sponsor  │               │
│  │ incl.  │$500/mo │$2000/mo  │               │
│  └────────┴────────┴──────────┘               │
│                                                 │
│  [Chat selected info / Direct info / etc.]     │
│                                                 │
│  ────────────────────────────────────────────  │
│  $999 ($499 with promo)      [Checkout →]     │
│  50% off! during Takeout 2 beta                │
│                                                 │
│  For companies with over $500k funding,        │
│  contact us for enterprise pricing.            │
│                                                 │
│  [License] [Policies] [FAQ]   [Stripe logo]   │
└─────────────────────────────────────────────────┘
```

### 3. FaqTabContent.tsx - New FAQ Items

**Add:**
```tsx
<Question>Can I buy licenses for multiple projects?</Question>
<P>
  Yes! Each license covers one project (web domain + iOS + Android apps).
  You can purchase additional project licenses anytime. Update subscriptions
  are always $300/year per project regardless of when you buy.
</P>

<Question>What's the difference between support levels?</Question>
<P>
  <strong>Chat (Included):</strong> Access to the private #takeout Discord
  channel. No SLA guarantee, but we typically respond within 1-2 business days.
  <br/><br/>
  <strong>Direct ($500/mo):</strong> 5 bug fixes per year, guaranteed response
  within 2 business days, your issues get prioritized in our queue.
  <br/><br/>
  <strong>Sponsor ($2,000/mo):</strong> Unlimited top-priority bug fixes
  (as capable), 1 day response time, plus a monthly video call with the team.
</P>

<Question>What if my company has raised over $500k in funding?</Question>
<P>
  Companies that have raised over $500,000 in funding should contact us at
  [email] for enterprise pricing. The standard license is intended for
  bootstrapped companies, solo developers, and early-stage startups.
</P>
```

### 4. Funding Threshold

Based on research, common thresholds include:
- **Visual Studio Community**: Under 250 PCs AND under $1M revenue
- **Tailwind UI**: Under $30k personal income for discounted license

**Recommended approach for Tamagui:**
- Standard price: For companies with **less than $500k in total funding raised**
- Enterprise: Contact us for companies with **$500k+ in funding**

This is similar to how many developer tools handle it - it's honor-system based but provides a clear line. The threshold is:
- High enough to include most indie hackers and bootstrapped businesses
- Low enough to capture well-funded startups for enterprise deals

### 5. NewAccountModal.tsx - Support Tier Management

Add the ability for logged-in users to:
- View current support tier
- Upgrade/downgrade support tier
- This goes through the existing payment flow (Stripe subscription change)

**Simplified approach:**
- When user changes support tier → show confirmation → redirect to payment modal with pre-selected tier
- Stripe handles proration automatically

---

## Stripe Updates (Later)

**New products needed:**
- `SUPPORT_DIRECT` - $500/month subscription
- `SUPPORT_SPONSOR` - $2,000/month subscription

**Remove/deprecate:**
- Current tiered support products ($800/$1600/$2400)

---

## Implementation Order

1. **Phase 1: Copy changes**
   - Update promoConfig.ts description
   - Update FaqTabContent.tsx with new questions

2. **Phase 2: Modal refactor**
   - Simplify NewPurchaseModal.tsx (remove tabs, add feature grid + support toggle)
   - Keep existing StripePaymentModal flow mostly unchanged

3. **Phase 3: Support tier update**
   - Update support tier values throughout codebase
   - Update NewAccountModal.tsx for tier management

4. **Phase 4: Stripe (later, manual)**
   - Create new Stripe products/prices
   - Update API endpoints to use new prices

---

## Questions to Confirm

1. **Funding threshold**: $500k seems reasonable. Alternatives:
   - $250k (more restrictive, captures more enterprises)
   - $1M (more permissive, common threshold)
   - Revenue-based instead (e.g., $1M ARR)

2. **Contact method**: Email? Form? Calendar link?

3. **Base plan support**: Confirmed - base plan explicitly has NO support SLA, just chat access

4. **Support tier names**: Chat | Direct | Sponsor - good names? Alternatives:
   - Community | Pro | Enterprise
   - Basic | Priority | Dedicated

---

## Notes

- This simplification should make the purchase decision faster
- Single screen = less cognitive load
- Clear support options with specific SLAs builds trust
- Funding threshold provides flexibility for enterprise deals without blocking small teams
