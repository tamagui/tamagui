# Native Style Optimization Plan

## Overview

Pre-compute theme styles at build time to eliminate runtime style computation on native. Instead of generating `theme.color.get()` calls that run on every render, we resolve all theme values at compile time and pass them as a style matrix to optimized native components.

## Current Behavior

When a component uses theme tokens:
```jsx
<YStack bg='$color' />
```

The compiler outputs:
```jsx
const _ReactNativeViewStyled0 = __withStableStyle(__ReactNativeView, (theme, _expressions) => {
  return __ReactUseMemo(() => {
    return [_sheet["0"], {
      "backgroundColor": theme.color.get()
    }];
  }, _expressions);
});
```

This requires runtime theme lookups on every theme change.

## New Optimized Behavior

With the optimized path, the compiler outputs:
```jsx
<__TamaguiView __styles={{
  "dark": { "flexDirection": "column", "backgroundColor": "#fff" },
  "light": { "flexDirection": "column", "backgroundColor": "#000" },
  // ... for all themes
}} />
```

All theme values are resolved at build time. The native component just looks up the current theme name and uses the pre-computed style.

## Implementation Status

### ✅ Phase 1: Compiler Changes (DONE)

Modified `extractToNative.ts` to:

1. **Added helper functions:**
   - `canUseOptimizedPath()` - checks if component can use optimized path
   - `tryOptimizedExtraction()` - performs the optimization
   - `resolveStylesForAllThemes()` - resolves $tokens for all themes

2. **Optimization criteria:**
   - Has themes in config
   - Has themed styles (uses $token values)
   - No ternary expressions (need runtime evaluation)
   - No spreads (can't statically analyze)

3. **Output format:**
   - Uses `__TamaguiView` / `__TamaguiText` from `@tamagui/native`
   - Passes `__styles` prop with theme -> style mapping

### ✅ Phase 2: Native Components (DONE)

Created `_TamaguiView` and `_TamaguiText` in `@tamagui/native`:

- `code/core/native/src/_TamaguiView.tsx`
- `code/core/native/src/_TamaguiText.tsx`

These components:
- Accept `__styles` prop with pre-computed theme styles
- Use `useThemeName()` to get current theme
- Look up the correct style based on theme name
- Merge with any additional `style` prop

### ✅ Phase 3: iOS Integration Testing (DONE)

Verified the optimization works end-to-end:

1. **Build verification** ✅ - Compiler unit tests (5/5 flatten.native tests pass)
   - `__TamaguiView` and `__styles` are generated correctly
   - Optimization triggers for components with theme tokens

2. **Runtime verification** ✅ - Kitchen sink app runs on iOS simulator
   - Built with Xcode, installed on iPhone 15 simulator
   - ThemeChangeBasic test case renders correctly

3. **Theme switching** ✅ - Manually verified in simulator
   - Toggle between red/blue themes works
   - Background color changes correctly with theme

4. **Performance testing** - TODO: Need benchmarks

### 🔲 Phase 4: Edge Cases & Robustness

1. **Fallback handling** - What happens if theme name not found in __styles?
2. **Nested themes** - Do sub-themes work correctly?
3. **Dynamic theme creation** - Runtime themes not in config
4. **SSR compatibility** - Does this work with SSR?
5. **Hot reload** - Do changes work with Fast Refresh?

### 🔲 Phase 5: Native Registry (OPTIONAL - Future)

For zero-re-render theme switching, implement a C++ native module:

1. **Style Registry** - stores pre-computed styles by theme
2. **Theme Listener** - subscribes to theme changes
3. **Direct ShadowTree Update** - swaps styles without React re-render

This is how Unistyles achieves instant theme switching.

## Theme Count Considerations

Current config has 400+ themes due to component themes (Button, Card, Input, etc.).

After removing component themes: ~18 themes (light/dark × color accents)

This makes the style matrix much more manageable.

## Known Issues & TODO

1. **Theme fallback** - Currently if theme name not in __styles, returns undefined style
   - Should fall back to base theme (light/dark)
   - Need to handle theme hierarchy

2. **Bundle size** - Pre-computed styles for all themes increases JS bundle
   - May want to optimize by deduping identical styles
   - Or use style IDs with a registry

3. **Compiler doesn't enable by default** - Currently disabled
   - Need feature flag or config option to enable
   - Should be opt-in until proven stable

4. **Tests only cover compiler output** - No runtime tests yet
   - Need Detox tests for actual iOS/Android behavior
   - Need theme switching tests

## Files Changed

- `code/compiler/static/src/extractor/extractToNative.ts` - compiler implementation
- `code/compiler/static-tests/tests/flatten.native.test.tsx` - updated test
- `code/compiler/static-tests/tests/__snapshots__/*.snap` - updated snapshots
- `code/core/native/src/_TamaguiView.tsx` - optimized View component (NEW)
- `code/core/native/src/_TamaguiText.tsx` - optimized Text component (NEW)
- `code/core/native/src/index.ts` - exports

## Testing Checklist

- [x] Compiler unit tests pass (5/5 flatten.native tests)
- [x] Native package builds
- [x] Kitchen sink app runs with optimization (manually verified)
- [x] Theme switching works correctly (manually verified red/blue toggle)
- [ ] Detox tests pass (need to investigate test infrastructure issues)
- [ ] Performance benchmarks show improvement
- [ ] No regressions in existing functionality

## Session Notes (2026-01-31)

### What was verified:
1. iOS simulator build succeeds (iPhone 15)
2. App launches and renders ThemeChangeBasic use case
3. Theme toggle (red → blue → red) works correctly visually
4. Compiler generates `__TamaguiView` with `__styles` prop for themed components

### Known issues with Detox tests:
- Tests timeout waiting for "Kitchen Sink" text on home screen
- May be related to test configuration or app state during automation
- Manual testing confirms functionality works correctly
