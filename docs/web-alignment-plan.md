# Tamagui v2 Web Alignment Plan

This document outlines the aggressive migration from React Native-specific props to web-standard props for Tamagui v2. Since v2 is a breaking change release, we're removing duplicate RN props entirely rather than maintaining backwards compatibility.

## Philosophy

**Web-first, native-mapped.** Tamagui v2 uses web-standard prop names exclusively. On native platforms, these props are automatically mapped to their React Native equivalents at runtime.

This aligns with:
- [React Native RFC #496](https://github.com/react-native-community/discussions-and-proposals/pull/496) - Reduce API fragmentation
- [React Strict DOM](https://facebook.github.io/react-strict-dom/) - Meta's future direction for cross-platform React
- React Native 0.71+ which added web-aligned props (`aria-*`, `role`, `id`, etc.)

## Already Complete in v2

- ✅ `transition` prop (not `animation`)
- ✅ `defaultPosition: 'static'` (web standard)
- ✅ `box-sizing: border-box` default
- ✅ `src` for Image (with `source` deprecated)
- ✅ `objectFit` for Image (with `resizeMode` deprecated)
- ✅ `onChange` for Input (with `onChangeText` deprecated)
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

### 4. Image Props

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `source` | `src` |
| `resizeMode` | `objectFit` |

**Already deprecated, now remove entirely.**

### 5. Input Props

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `onChangeText` | `onChange` |
| `keyboardType` | `inputMode` / `type` |
| `returnKeyType` | `enterKeyHint` |
| `editable` | `readOnly` (inverted) |

**Already deprecated, now remove entirely.**

### 6. Shadow Props → boxShadow

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `shadowColor` | `boxShadow` |
| `shadowOffset` | `boxShadow` |
| `shadowOpacity` | `boxShadow` |
| `shadowRadius` | `boxShadow` |
| `elevation` (Android) | `boxShadow` |

**New syntax:**
```tsx
// Web-style string with token support
<View boxShadow="0 2px 10px $shadowColor" />

// Or object style (parsed to string)
<View boxShadow={{ x: 0, y: 2, blur: 10, color: '$shadowColor' }} />
```

**Implementation:**
- Native runtime parses `boxShadow` string → individual shadow props
- Already have `boxShadow` support, need to add native parsing

### 7. Text Props

| Removed (RN) | Use Instead (Web) |
|--------------|-------------------|
| `selectable` | `userSelect` (style) |
| `suppressHighlighting` | Remove (RN-only quirk) |

## Files to Modify

### Types (remove RN props)
- `code/core/web/src/types.tsx` - Remove deprecated accessibility props (lines 2152-2209)
- `code/core/web/src/interfaces/TamaguiComponentPropsBaseBase.tsx` - Remove `focusable`, add event mappings
- `code/ui/image/src/types.ts` - Remove `source`, `resizeMode`
- `code/ui/input/src/types.ts` - Remove `onChangeText`, `keyboardType`, `returnKeyType`

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
- `source={{ uri: x }}` → `src={x}`
- etc.

## Timeline

1. **Phase 1: Types** - Remove RN props from TypeScript types
2. **Phase 2: Runtime** - Remove RN prop handling, rely on native mappings
3. **Phase 3: Docs** - Update all documentation
4. **Phase 4: Codemod** - Ship migration tool

## Notes

- React Native 0.71+ supports both old and new prop names, so native mapping is safe
- React Strict DOM uses web props exclusively, this aligns Tamagui with that future
- Breaking changes are acceptable in v2 major release
- Codemod makes migration mechanical for users
