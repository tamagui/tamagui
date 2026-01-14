# Tamagui v2 Web Alignment Plan

This document outlines the aggressive migration from React Native-specific props to web-standard props for Tamagui v2. Since v2 is a breaking change release, we're removing duplicate RN props entirely rather than maintaining backwards compatibility.

## Philosophy

**Web-first, native-mapped.** Tamagui v2 uses web-standard prop names exclusively. On native platforms, these props are automatically mapped to their React Native equivalents at runtime.

This aligns with:
- [React Native RFC #496](https://github.com/react-native-community/discussions-and-proposals/pull/496) - Reduce API fragmentation
- [React Strict DOM](https://facebook.github.io/react-strict-dom/) - Meta's future direction for cross-platform React
- React Native 0.71+ which added web-aligned props (`aria-*`, `role`, `id`, etc.)
- React Native 0.76+ which added `boxShadow` and `filter` style props

## Already Complete in v2

- ✅ `transition` prop (not `animation`)
- ✅ `defaultPosition: 'static'` (web standard)
- ✅ `box-sizing: border-box` default
- ✅ Image component (new web-aligned component with `src`, `objectFit`)
- ✅ `inputMode` for Input
- ✅ `enterKeyHint` for Input

## v2 Breaking Changes

### 1. Accessibility Props → ARIA Props

**Remove entirely (types + runtime):**

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `accessibilityRole` | `role` |
| `accessibilityLabel` | `aria-label` |
| `accessibilityLabelledBy` | `aria-labelledby` |
| `accessibilityHint` | `aria-describedby` |
| `accessibilityState.disabled` | `aria-disabled` |
| `accessibilityState.selected` | `aria-selected` |
| `accessibilityState.checked` | `aria-checked` |
| `accessibilityState.busy` | `aria-busy` |
| `accessibilityState.expanded` | `aria-expanded` |
| `accessibilityValue.min` | `aria-valuemin` |
| `accessibilityValue.max` | `aria-valuemax` |
| `accessibilityValue.now` | `aria-valuenow` |
| `accessibilityValue.text` | `aria-valuetext` |
| `accessibilityElementsHidden` | `aria-hidden` |
| `accessibilityViewIsModal` | `aria-modal` |
| `accessibilityLiveRegion` | `aria-live` |
| `accessible` | `tabIndex={0}` |
| `nativeID` | `id` |

**Implementation:**
- Remove from `TamaguiComponentPropsBaseBase` types
- Native runtime maps `aria-*` → `accessibilityX` automatically (already done in `createOptimizedView.native.tsx`)
- Web runtime passes through directly (already done)

### 2. Focus Props

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `focusable` | `tabIndex` |

**Values:**
- `tabIndex={0}` = focusable (was `focusable={true}`)
- `tabIndex={-1}` = not focusable (was `focusable={false}`)

### 3. Event Handlers

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `onPress` | `onClick` |
| `onPressIn` | `onPointerDown` |
| `onPressOut` | `onPointerUp` |
| `onLongPress` | `onContextMenu` (or custom) |

**Implementation:**
- Native runtime maps `onClick` → `onPress`, etc.
- Web runtime passes through directly
- `onLongPress` may need a custom hook/helper for web since `onContextMenu` isn't equivalent

### 4. Input Props

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `keyboardType` | `inputMode` / `type` |
| `returnKeyType` | `enterKeyHint` |
| `editable` | `readOnly` (inverted) |

**Exception:** `onChangeText` is kept for convenience (common RN pattern).

### 5. Shadow Props → boxShadow

React Native 0.76+ natively supports `boxShadow` with New Architecture. This is not a custom Tamagui feature - it's native RN.

| Removed (RN) | Use Instead (Web/RN 0.76+) |
|--------------|----------------------------|
| `shadowColor` | `boxShadow` |
| `shadowOffset` | `boxShadow` |
| `shadowOpacity` | `boxShadow` |
| `shadowRadius` | `boxShadow` |
| `elevation` (Android) | `boxShadow` |

**Native RN 0.76+ syntax:**
```tsx
// String format (CSS-like)
boxShadow: '5 5 5 0 rgba(255, 0, 0, 0.5)'

// Object format
boxShadow: {
  offsetX: 5,
  offsetY: 5,
  blurRadius: 5,
  spreadDistance: 0,
  color: 'rgba(255, 0, 0, 0.5)'
}

// Multiple shadows (array)
boxShadow: [
  { offsetX: 0, offsetY: 1, blurRadius: 2, color: 'rgba(0, 0, 0, 0.22)' },
  { offsetX: 0, offsetY: 6, blurRadius: 16, color: 'rgba(0, 0, 0, 0.22)' }
]
```

**Platform requirements:**
- New Architecture required (default in RN 0.76+)
- Android 9+ for normal shadows
- Android 10+ for inset shadows

**Tamagui addition:** Support `$token` colors in boxShadow strings:
```tsx
<View boxShadow="0 2px 10px $shadowColor" />
```

### 6. Text Props

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `selectable` | `userSelect` (style) |
| `suppressHighlighting` | Remove (RN-only quirk) |

## Files to Modify

### Types (remove RN props)
- `code/core/web/src/types.tsx` - Remove deprecated accessibility props (lines 2152-2209)
- `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx` - Remove `focusable`, add event mappings

### Runtime (native mappings)
- `code/core/core/src/createOptimizedView.native.tsx` - Already maps aria→accessibility, add event mappings
- `code/core/web/src/helpers/getSplitStyles.tsx` - Remove RN prop handling
- `code/core/react-native-web-internals/src/modules/createDOMProps/index.tsx` - Simplify (web props only)

### Documentation
- Update all component docs to use web props only
- Add migration guide for v1 → v2
- Update props reference pages

## Migration Codemod

Provide a codemod for users:

```bash
npx @tamagui/cli migrate-v2
```

Transforms:
- `accessibilityLabel="X"` → `aria-label="X"`
- `accessibilityRole="button"` → `role="button"`
- `onPress={fn}` → `onClick={fn}`
- `focusable={true}` → `tabIndex={0}`
- `shadowColor/shadowOffset/etc` → `boxShadow`
- etc.

## Timeline

1. **Phase 1: Types** - Remove RN props from TypeScript types
2. **Phase 2: Runtime** - Remove RN prop handling, rely on native mappings
3. **Phase 3: Docs** - Update all documentation
4. **Phase 4: Codemod** - Ship migration tool

## Notes

- React Native 0.71+ supports both old and new prop names, so native mapping is safe
- React Native 0.76+ supports `boxShadow` natively (New Architecture)
- React Strict DOM uses web props exclusively, this aligns Tamagui with that future
- Breaking changes are acceptable in v2 major release
- Codemod makes migration mechanical for users
- `onChangeText` kept as exception (common pattern, ergonomic for RN devs)
