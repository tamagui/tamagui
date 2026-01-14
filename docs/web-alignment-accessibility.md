# Web Alignment: Accessibility Props

## Overview

Tamagui v2 adopts web-standard accessibility props (`aria-*`, `role`) as the primary API, replacing React Native's `accessibilityX` props. This aligns with React Native's own direction (see [RFC #496](https://github.com/react-native-community/discussions-and-proposals/pull/496)) and React Strict DOM.

## Current Behavior (v1)

### On Web

| User writes | Tamagui outputs |
|-------------|-----------------|
| `accessibilityLabel="X"` | `aria-label="X"` |
| `accessibilityRole="button"` | `role="button"` |
| `accessibilityHidden={true}` | `aria-hidden="true"` |
| `accessibilityChecked={true}` | `aria-checked="true"` |
| `accessibilityExpanded={true}` | `aria-expanded="true"` |
| `accessibilitySelected={true}` | `aria-selected="true"` |
| `accessibilityDisabled={true}` | `aria-disabled="true"` |
| `accessibilityBusy={true}` | `aria-busy="true"` |
| `accessibilityModal={true}` | `aria-modal="true"` |
| `accessibilityLiveRegion="polite"` | `aria-live="polite"` |
| `accessibilityLabelledBy="id"` | `aria-labelledby="id"` |
| `accessibilityDescribedBy="id"` | `aria-describedby="id"` |
| `aria-label="X"` | `aria-label="X"` (passthrough) |
| `role="button"` | `role="button"` (passthrough) |

**Implementation:** `getSplitStyles.tsx` uses `accessibilityDirectMap` to convert `accessibilityX` → `aria-x`.

### On Native

| User writes | Tamagui outputs |
|-------------|-----------------|
| `accessibilityLabel="X"` | `accessibilityLabel="X"` (passthrough) |
| `accessibilityRole="button"` | `accessibilityRole="button"` (passthrough) |
| `aria-label="X"` | `aria-label="X"` (RN 0.71+ handles natively) |
| `role="button"` | `role="button"` (RN 0.71+ handles natively) |

**Key insight:** React Native 0.71+ natively supports `aria-*` props and `role`:
- `aria-label` → maps to `accessibilityLabel`
- `aria-hidden` → maps to `accessibilityElementsHidden`
- `aria-checked` → maps to `accessibilityState.checked`
- `role` → maps to `accessibilityRole`
- etc.

## v2 Behavior (Target)

### On Web

| User writes | Tamagui outputs |
|-------------|-----------------|
| `aria-label="X"` | `aria-label="X"` (passthrough) |
| `role="button"` | `role="button"` (passthrough) |
| `accessibilityLabel="X"` | **IGNORED** (no output) |
| `accessibilityRole="button"` | **IGNORED** (no output) |

### On Native

| User writes | Tamagui outputs |
|-------------|-----------------|
| `aria-label="X"` | `aria-label="X"` (RN handles natively) |
| `role="button"` | `role="button"` (RN handles natively) |
| `accessibilityLabel="X"` | **IGNORED** (no output) |
| `accessibilityRole="button"` | **IGNORED** (no output) |

## React Native's Native Support (0.71+)

React Native 0.71+ added native support for ARIA props. The RN runtime internally maps:

```
aria-label        → accessibilityLabel
aria-labelledby   → accessibilityLabelledBy
aria-describedby  → accessibilityHint (partial)
aria-hidden       → accessibilityElementsHidden
aria-checked      → accessibilityState.checked
aria-disabled     → accessibilityState.disabled
aria-expanded     → accessibilityState.expanded
aria-selected     → accessibilityState.selected
aria-busy         → accessibilityState.busy
aria-modal        → accessibilityViewIsModal
aria-live         → accessibilityLiveRegion
aria-valuemin     → accessibilityValue.min
aria-valuemax     → accessibilityValue.max
aria-valuenow     → accessibilityValue.now
aria-valuetext    → accessibilityValue.text
role              → accessibilityRole
tabIndex          → focusable (0 = true, -1 = false)
```

## Migration for Users

### Before (v1)
```tsx
<View
  accessibilityLabel="Submit button"
  accessibilityRole="button"
  accessibilityHint="Submits the form"
/>
```

### After (v2)
```tsx
<View
  aria-label="Submit button"
  role="button"
  aria-describedby="submit-hint"
/>
```

### Mapping Reference

| v1 (RN-style) | v2 (Web-style) |
|---------------|----------------|
| `accessibilityLabel` | `aria-label` |
| `accessibilityRole` | `role` |
| `accessibilityHint` | `aria-describedby` (with id ref) |
| `accessibilityState.disabled` | `aria-disabled` |
| `accessibilityState.checked` | `aria-checked` |
| `accessibilityState.expanded` | `aria-expanded` |
| `accessibilityState.selected` | `aria-selected` |
| `accessibilityState.busy` | `aria-busy` |
| `accessibilityValue.min` | `aria-valuemin` |
| `accessibilityValue.max` | `aria-valuemax` |
| `accessibilityValue.now` | `aria-valuenow` |
| `accessibilityValue.text` | `aria-valuetext` |
| `accessibilityElementsHidden` | `aria-hidden` |
| `accessibilityViewIsModal` | `aria-modal` |
| `accessibilityLiveRegion` | `aria-live` |
| `accessibilityLabelledBy` | `aria-labelledby` |
| `accessible` | `tabIndex={0}` |
| `focusable` | `tabIndex` |

## Implementation Plan

### Phase 1: Types
- Remove `A11yDeprecated` type from `types.tsx`
- Remove `accessibilityX` props from `StackNonStyleProps` and `TextNonStyleProps`
- Keep `aria-*` and `role` props (already supported via `ViewProps`)

### Phase 2: Runtime (Web)
- Empty `accessibilityDirectMap` (no more conversions)
- Remove the switch statement in `getSplitStyles.tsx` that handles `accessibilityRole`, `accessibilityLabelledBy`, etc.
- `aria-*` props already pass through correctly

### Phase 3: Runtime (Native)
- Verify `aria-*` props pass through to RN correctly
- RN 0.71+ handles the mapping internally
- No Tamagui-side conversion needed

### Phase 4: Focusable
- Remove `focusable` prop support
- Users should use `tabIndex={0}` or `tabIndex={-1}`

## Testing Plan

### Web Tests
1. Verify `aria-label` appears in DOM as `aria-label`
2. Verify `role` appears in DOM as `role`
3. Verify `accessibilityLabel` does NOT appear in DOM (not converted)
4. Verify `accessibilityRole` does NOT appear in DOM (not converted)

### Native Tests
1. Verify `aria-label` is passed to RN component
2. Verify `role` is passed to RN component
3. Verify RN properly handles these props (screen reader announces correctly)
4. Verify `accessibilityLabel` is NOT passed (ignored)

### Compiler Tests
1. Verify static extraction preserves `aria-*` props
2. Verify static extraction preserves `role`
3. Verify `accessibilityX` props are not in extracted output

## Requirements

**React Native 0.83+ minimum** - Tamagui v2 requires RN 0.83 or later. This version has mature support for web-standard accessibility props (`aria-*`, `role`, `tabIndex`).

## Questions to Verify

1. ~~**RN 0.71 requirement**: Are we OK requiring RN 0.71+ for native?~~ **DECIDED: RN 0.83 minimum**

2. **accessibilityHint**: Web has no direct equivalent. `aria-describedby` requires an ID reference. Should we:
   - Drop support entirely (users create their own description element)?
   - Log a warning if used?

3. **Codemod**: Should we provide a codemod to automatically migrate `accessibilityX` → `aria-*`?

## References

- [React Native Accessibility Docs](https://reactnative.dev/docs/accessibility)
- [React Native RFC #496 - Reduce API Surface](https://github.com/react-native-community/discussions-and-proposals/pull/496)
- [React Strict DOM](https://github.com/nickymarino/react-strict-dom)
- [WAI-ARIA Specification](https://www.w3.org/TR/wai-aria-1.2/)
