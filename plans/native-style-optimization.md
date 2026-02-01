# Native Style Optimization Plan

## Problem

On native, Tamagui's compiler outputs `StyleSheet.create()` but still requires runtime work:

```jsx
// Current compiler output (extractToNative.ts)
const _sheet = __ReactNativeStyleSheet.create({
  "0": { flexDirection: "column", padding: 16 }  // static
});

// For themed styles, wraps in HOC:
const _ViewStyled0 = __withStableStyle(__ReactNativeView, (theme, _expressions) => {
  return __ReactUseMemo(() => {
    return [_sheet["0"], { color: theme.color.get() }];  // runtime theme lookup
  }, _expressions);
});
```

Problems with current approach:
1. `theme.color.get()` runs every render
2. `useMemo` overhead
3. `_withStableStyle` HOC creates extra component layers
4. Theme changes trigger React re-renders for all themed components
5. `splitThemeStyles()` separates static vs themed at compile time, but themed still resolved at runtime

The compiler already knows all theme values at build time. It could pre-compute `{ color: '#fff' }` for light and `{ color: '#000' }` for dark instead of `theme.color.get()`.

## Goal

Eliminate runtime style computation for statically-analyzable components:
- Theme changes swap pre-computed StyleSheet references without React re-renders
- No hooks, no HOCs, no `.get()` calls for compiled components
- Native module handles the style swap directly on ShadowTree

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                         BUILD TIME (Compiler)                        │
├─────────────────────────────────────────────────────────────────────┤
│  Input:  <YStack bg="$background" p="$4" />                         │
│                                                                      │
│  1. Resolve $background for EACH theme:                             │
│     - light: #ffffff                                                │
│     - dark:  #000000                                                │
│                                                                      │
│  2. Generate style matrix:                                          │
│     const _styles = {                                               │
│       light: StyleSheet.create({ "0": { bg: "#fff", p: 16 } }),    │
│       dark:  StyleSheet.create({ "0": { bg: "#000", p: 16 } }),    │
│     }                                                               │
│                                                                      │
│  3. Output component with all variants:                             │
│     <__TamaguiView __styles={_styles} __styleKey="0" />             │
└─────────────────────────────────────────────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                         RUNTIME (Native)                            │
├─────────────────────────────────────────────────────────────────────┤
│  __TamaguiView:                                                     │
│    1. On mount: register(shadowNode, __styles, scopeId)             │
│    2. Render with current theme's style                             │
│    3. On unmount: unregister(shadowNode)                            │
│                                                                      │
│  Theme component:                                                   │
│    1. Creates scope ID                                              │
│    2. On theme change: registry.setTheme(scopeId, 'dark')           │
│                                                                      │
│  Native Registry (C++/JSI):                                         │
│    1. Receives setTheme(scopeId, themeName)                         │
│    2. Walks all views in that scope                                 │
│    3. Swaps style prop: view.style = view.__styles[themeName]["0"]  │
│    4. Commits ShadowTree update (Fabric)                            │
│    5. NO React re-render                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Detailed Implementation

### 1. Compiler Changes (`extractToNative.ts`)

Currently `splitThemeStyles()` separates themed values:
```typescript
function splitThemeStyles(style: Object) {
  const themed: Object = {}
  const plain: Object = {}
  for (const key in style) {
    const val = style[key]
    if (val && val[0] === '$') {
      themed[key] = val  // e.g. { color: '$background' }
    } else {
      plain[key] = val   // e.g. { padding: 16 }
    }
  }
  return { themed, plain }
}
```

**Change to:** Resolve themed values for ALL themes at compile time:

```typescript
function resolveStylesForAllThemes(style: Object, themes: Record<string, Theme>) {
  const result: Record<string, Object> = {}

  for (const themeName of Object.keys(themes)) {
    const theme = themes[themeName]
    const resolved = {}

    for (const key in style) {
      const val = style[key]
      if (val && val[0] === '$') {
        // Resolve token: $background -> theme.background -> '#fff'
        const tokenName = val.slice(1)
        resolved[key] = theme[tokenName]?.val ?? val
      } else {
        resolved[key] = val
      }
    }

    result[themeName] = resolved
  }

  return result
}
```

**New compiler output:**

```jsx
// Instead of:
const _sheet = StyleSheet.create({ "0": { padding: 16 } });
const _ViewStyled0 = __withStableStyle(__ReactNativeView, (theme) => {
  return [_sheet["0"], { color: theme.color.get() }];
});

// Generate:
const _styles = {
  light: StyleSheet.create({
    "0": { padding: 16, backgroundColor: "#ffffff", color: "#000000" }
  }),
  dark: StyleSheet.create({
    "0": { padding: 16, backgroundColor: "#000000", color: "#ffffff" }
  }),
};

<__TamaguiView
  __styles={_styles}
  __styleKey="0"
/>
```

No HOC. No hooks. Just data.

### 2. Native View Components

Create `@tamagui/native-views` or add to `@tamagui/native`:

```tsx
// TamaguiView.tsx
import { View } from 'react-native'
import { useContext, useEffect, useRef } from 'react'
import { TamaguiStyleRegistry } from './registry'
import { ThemeScopeContext } from './ThemeScopeContext'

type StyleMatrix = Record<string, ReturnType<typeof StyleSheet.create>>

interface TamaguiViewProps {
  __styles?: StyleMatrix
  __styleKey?: string
  __mediaKeys?: string[]
  style?: any  // fallback for uncompiled
  children?: React.ReactNode
  // ... other View props
}

export const __TamaguiView = ({
  __styles,
  __styleKey = "0",
  __mediaKeys,
  style,
  children,
  ...props
}: TamaguiViewProps) => {
  const ref = useRef<View>(null)
  const scopeId = useContext(ThemeScopeContext)
  const currentTheme = useContext(ThemeNameContext)  // for initial render

  useEffect(() => {
    if (!__styles || !ref.current) return

    // Register with native registry
    TamaguiStyleRegistry.register(
      ref.current,
      __styles,
      __styleKey,
      scopeId,
      __mediaKeys
    )

    return () => {
      TamaguiStyleRegistry.unregister(ref.current)
    }
  }, [__styles, __styleKey, scopeId])

  // Initial render uses current theme
  // After mount, native registry handles updates
  const initialStyle = __styles
    ? __styles[currentTheme]?.[__styleKey]
    : style

  return (
    <View ref={ref} style={initialStyle} {...props}>
      {children}
    </View>
  )
}
```

Same pattern for `__TamaguiText`, `__TamaguiImage`, etc.

### 3. Native Style Registry (JSI Module)

This is the core. A C++ module using JSI (like Reanimated does) that:

```
┌─────────────────────────────────────────────────────────────────┐
│                    TamaguiStyleRegistry                         │
├─────────────────────────────────────────────────────────────────┤
│  Data Structures:                                               │
│  ─────────────────                                              │
│  _views: Map<ShadowNodeFamily*, ViewStyleData>                  │
│    ViewStyleData {                                              │
│      styles: Record<themeName, StyleSheet>                      │
│      styleKey: string                                           │
│      scopeId: string                                            │
│      mediaKeys: string[]                                        │
│    }                                                            │
│                                                                 │
│  _scopes: Map<scopeId, themeName>                              │
│    // Which theme is active in each scope                       │
│                                                                 │
│  _media: Map<mediaKey, boolean>                                │
│    // Current media query matches                               │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│  Methods:                                                       │
│  ────────                                                       │
│                                                                 │
│  register(ref, styles, styleKey, scopeId, mediaKeys)           │
│    → Get ShadowNode from ref                                    │
│    → Store in _views map                                        │
│                                                                 │
│  unregister(ref)                                                │
│    → Remove from _views map                                     │
│                                                                 │
│  setTheme(scopeId, themeName)                                  │
│    → Update _scopes[scopeId] = themeName                       │
│    → Find all views where view.scopeId === scopeId             │
│    → For each: update style to styles[themeName][styleKey]     │
│    → Batch commit to ShadowTree                                │
│                                                                 │
│  setMedia(mediaMatches: Record<string, boolean>)               │
│    → Update _media                                              │
│    → Find all views with matching mediaKeys                     │
│    → Update their styles                                        │
│    → Batch commit to ShadowTree                                │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Key insight from studying other libraries:** The ShadowTree update mechanism (Fabric) allows direct style updates without React reconciliation:

```cpp
// Simplified - actual implementation needs proper Fabric integration
void TamaguiStyleRegistry::setTheme(string scopeId, string themeName) {
    scopes[scopeId] = themeName;

    ShadowLeafUpdates updates;

    for (auto& [family, viewData] : views) {
        if (viewData.scopeId == scopeId) {
            auto& styles = viewData.styles;
            auto& newStyle = styles[themeName][viewData.styleKey];
            updates[family] = newStyle;
        }
    }

    // Commit all updates in single transaction
    commitShadowTreeUpdates(updates);
}
```

### 4. Theme Component Integration

Modify the `Theme` component to notify the native registry:

```tsx
// Theme.tsx
import { useId, useLayoutEffect, useMemo } from 'react'
import { TamaguiStyleRegistry } from '@tamagui/native'
import { ThemeScopeContext } from './ThemeScopeContext'

export function Theme({ name, children, ...props }) {
  const scopeId = useId()

  useLayoutEffect(() => {
    // Tell native registry about theme change in this scope
    TamaguiStyleRegistry.setTheme(scopeId, name)
  }, [scopeId, name])

  return (
    <ThemeScopeContext.Provider value={scopeId}>
      {/* existing theme context stuff */}
      {children}
    </ThemeScopeContext.Provider>
  )
}
```

Nested themes work automatically - each gets its own scope ID.

### 5. Media Query Handling

Media queries are already detected by the compiler. Extend to work the same way:

```jsx
// Compiler output for: <YStack p="$4" $md={{ p: '$6' }} />
const _styles = {
  light: {
    base: StyleSheet.create({ "0": { padding: 16 } }),
    md: StyleSheet.create({ "0": { padding: 24 } }),
  },
  dark: {
    base: StyleSheet.create({ "0": { padding: 16 } }),
    md: StyleSheet.create({ "0": { padding: 24 } }),
  },
};

<__TamaguiView
  __styles={_styles}
  __styleKey="0"
  __mediaKeys={["md"]}
/>
```

JS side listens to dimension changes and notifies registry:

```tsx
// In app setup
import { Dimensions } from 'react-native'
import { TamaguiStyleRegistry } from '@tamagui/native'
import { mediaQueryConfig } from './tamagui.config'

function evaluateMediaQueries(window) {
  const matches = {}
  for (const [key, query] of Object.entries(mediaQueryConfig)) {
    matches[key] = checkMediaQuery(query, window)
  }
  return matches
}

Dimensions.addEventListener('change', ({ window }) => {
  const matches = evaluateMediaQueries(window)
  TamaguiStyleRegistry.setMedia(matches)
})

// Initial
TamaguiStyleRegistry.setMedia(evaluateMediaQueries(Dimensions.get('window')))
```

### 6. Setup via @tamagui/native

Add to `@tamagui/native`:

```tsx
// @tamagui/native/src/setup-style-registry.ts
import { TamaguiStyleRegistry } from './TamaguiStyleRegistry'
import { Dimensions } from 'react-native'

export function setupStyleRegistry(config: {
  themes: string[],
  mediaQueries: Record<string, MediaQuery>,
  initialTheme: string
}) {
  // Initialize registry with theme names
  TamaguiStyleRegistry.initialize(config.themes)

  // Setup media query listeners
  const evaluateMedia = (window) => {
    const matches = {}
    for (const [key, query] of Object.entries(config.mediaQueries)) {
      matches[key] = checkMediaQuery(query, window)
    }
    return matches
  }

  Dimensions.addEventListener('change', ({ window }) => {
    TamaguiStyleRegistry.setMedia(evaluateMedia(window))
  })

  TamaguiStyleRegistry.setMedia(evaluateMedia(Dimensions.get('window')))
}
```

Usage:
```tsx
// App entry
import '@tamagui/native/setup-style-registry'
```

Or with config:
```tsx
import { setupStyleRegistry } from '@tamagui/native'
import { config } from './tamagui.config'

setupStyleRegistry({
  themes: Object.keys(config.themes),
  mediaQueries: config.media,
  initialTheme: 'light'
})
```

---

## Fallback Path (Dynamic/Uncompiled Styles)

When the compiler can't statically analyze (dynamic values, spreads, etc.), it falls back to current behavior:

```jsx
// This can't be pre-computed
<YStack bg={someVariable ? '$red' : '$blue'} />

// Compiler outputs current HOC pattern
const _ViewStyled0 = __withStableStyle(__View, (theme) => { ... })
```

These components:
- Don't register with native registry
- Use existing runtime resolution
- Re-render on theme change like today

**Sync strategy:** When theme changes:
1. Native registry updates compiled views immediately (no re-render)
2. React context change triggers re-render for dynamic components
3. Both complete before next frame

The dynamic components are the same speed as today - this is purely additive.

---

## Variants Support

Component variants can be pre-computed the same way:

```tsx
// Input
<Button size="$lg" variant="primary" />

// If variant values are static, compiler can pre-compute all combinations:
const _styles = {
  light: {
    'sm-primary': StyleSheet.create({ "0": { height: 32, bg: '#007bff' } }),
    'sm-secondary': StyleSheet.create({ "0": { height: 32, bg: '#6c757d' } }),
    'md-primary': StyleSheet.create({ "0": { height: 40, bg: '#007bff' } }),
    'md-secondary': StyleSheet.create({ "0": { height: 40, bg: '#6c757d' } }),
    'lg-primary': StyleSheet.create({ "0": { height: 48, bg: '#007bff' } }),
    'lg-secondary': StyleSheet.create({ "0": { height: 48, bg: '#6c757d' } }),
  },
  dark: { ... }
}

<__TamaguiView
  __styles={_styles}
  __styleKey="lg-primary"  // computed from props
/>
```

The `__styleKey` is computed at render time from variant props, but the styles themselves are pre-computed.

---

## Press/Hover/Focus States

These could also be pre-computed:

```jsx
// Input
<Button pressStyle={{ scale: 0.98, bg: '$backgroundPress' }} />

// Pre-compute pressed state for each theme:
const _styles = {
  light: {
    default: StyleSheet.create({ "0": { bg: '#fff' } }),
    pressed: StyleSheet.create({ "0": { bg: '#eee', transform: [{ scale: 0.98 }] } }),
  },
  dark: {
    default: StyleSheet.create({ "0": { bg: '#000' } }),
    pressed: StyleSheet.create({ "0": { bg: '#222', transform: [{ scale: 0.98 }] } }),
  }
}
```

Native registry could handle press state too - gesture recognizer updates style without React.

But this might be overkill - the current animation driver approach may be sufficient for press states. Evaluate after core theme switching works.

---

## Implementation Phases

### Phase 1: Proof of Concept
1. Modify `extractToNative.ts` to output style matrix for simple cases
2. Create basic `__TamaguiView` component
3. Create JS-only registry (no native module yet) that just stores/retrieves styles
4. Test theme switching works without native module

### Phase 2: Native Module (JSI)
1. Create C++ native module with JSI bindings
2. Implement view registration/unregistration
3. Implement `setTheme()` with ShadowTree updates
4. Wire up to `@tamagui/native` setup pattern

### Phase 3: Theme Integration
1. Modify `Theme` component to use registry
2. Handle nested theme scopes
3. Test performance vs current approach

### Phase 4: Media Queries
1. Extend compiler to output media variants
2. Implement `setMedia()` in native module
3. Add dimension change listeners

### Phase 5: Variants & Edge Cases
1. Handle component variants in compiler
2. Handle ternary expressions
3. Fallback path for dynamic styles
4. Sync between compiled and dynamic components

### Phase 6: Press/Hover (Optional)
1. Evaluate if needed beyond animation drivers
2. If yes: extend registry for interaction states

---

## Bundle Size Considerations

Pre-computing all theme variants increases JS bundle:

```
2 themes × 1 component = 2 style objects
2 themes × 100 components = 200 style objects
18 themes × 100 components = 1800 style objects
```

**Good news:** Component themes (Button, Card, etc) are being removed. Without those, theme count drops dramatically:

- v5 themes = 2 base (light/dark) × ~9 color accents = **~18 themes**
- Most apps use 2-4 themes total

This is totally manageable. 18 StyleSheets per component type is fine.

For apps with more themes, mitigations:
1. **Lazy loading:** Only include themes that are actually used
2. **Shared styles:** If two themes have same value for a property, share the StyleSheet
3. **Splitting:** Put theme-specific styles in separate chunks, load on demand

---

## Comparison to Current

| Aspect | Current | Optimized |
|--------|---------|-----------|
| Theme change | React re-render + hooks | Native style swap, no re-render |
| Runtime work | `theme.X.get()` every render | None for compiled |
| Component layers | HOC wrapper | Direct View |
| Memory | One StyleSheet + runtime objects | One StyleSheet per theme |
| Bundle size | Smaller | Slightly larger |
| Fallback | N/A | Same as current |

---

## Files to Modify

**Compiler:**
- `code/compiler/static/src/extractor/extractToNative.ts` - main changes
- `code/compiler/static/src/extractor/createExtractor.ts` - pass theme data

**Native package:**
- `code/core/native/src/TamaguiStyleRegistry.ts` - new file
- `code/core/native/src/TamaguiView.tsx` - new file
- `code/core/native/src/TamaguiText.tsx` - new file
- `code/core/native/src/setup-style-registry.ts` - new file
- `code/core/native/src/index.ts` - exports

**Native module (new package or in native):**
- `ios/TamaguiStyleRegistry.mm`
- `android/src/main/java/com/tamagui/TamaguiStyleRegistry.kt`
- `cpp/TamaguiStyleRegistry.cpp` (shared C++)

**Core:**
- `code/core/web/src/views/Theme.tsx` - integrate with registry
