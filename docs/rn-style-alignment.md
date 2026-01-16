# React Native Style Alignment (0.77 - 0.83)

This document tracks Tamagui's alignment with React Native's new CSS-like style props introduced in versions 0.77-0.83.

**Last Updated:** 2026-01-15
**Manual Test Count:** 0

## Summary of New RN Style Props by Version

### RN 0.77 (January 2025)
| Prop | Type | Platform | Notes |
|------|------|----------|-------|
| `display: 'contents'` | enum value | All (New Arch) | Element disappears from layout, children render as parent's direct children |
| `boxSizing` | `'border-box' \| 'content-box'` | All (New Arch) | Controls how width/height are calculated |
| `mixBlendMode` | 16 blend modes | All (New Arch) | Controls color blending with stacking context |
| `isolation` | `'isolate'` | All (New Arch) | Forces stacking context for mixBlendMode |
| `outlineWidth` | number | All (New Arch) | Outline width (doesn't affect layout) |
| `outlineStyle` | `'solid' \| 'dotted' \| 'dashed'` | All (New Arch) | Outline style |
| `outlineColor` | color | All (New Arch) | Outline color |
| `outlineOffset` | number | All (New Arch) | Space between outline and element |

### RN 0.76 (October 2024) - New Architecture Default
| Prop | Type | Platform | Notes |
|------|------|----------|-------|
| `boxShadow` | `BoxShadowValue[] \| string` | iOS, Android 9+ (New Arch) | Full CSS-like shadow support |
| `filter` | `FilterFunction[] \| string` | Partial (New Arch) | Graphical filters |
| `cursor` | `'auto' \| 'pointer'` | iOS 17+ | Hover effects for trackpad/stylus |

### RN 0.79 (April 2025)
- Enforced CSS-compliant units in boxShadow/filter (`1px 1px black` not `1 1 black`)

### RN 0.82 (October 2025)
- New Architecture only (old arch deprecated)
- DOM-like Node APIs via refs

### RN 0.83 (December 2025)
- No breaking changes
- Animation backend support for all style props

---

## BoxShadowValue Object Type

```typescript
interface BoxShadowValue {
  offsetX: number | string;      // Required - horizontal offset
  offsetY: number | string;      // Required - vertical offset
  blurRadius?: number | string;  // Optional - blur amount (default: 0)
  spreadDistance?: number | string; // Optional - spread (default: 0)
  color?: ColorValue;            // Optional - shadow color (default: black)
  inset?: boolean;               // Optional - inset shadow (default: false)
}
```

**String format:** `"offsetX offsetY [blurRadius] [spreadDistance] [color] [inset]"`
- Example: `"10px 5px 15px 0px rgba(0,0,0,0.5)"`
- Example: `"inset 0px 2px 4px black"`

---

## Filter Functions

| Function | Type | Platform |
|----------|------|----------|
| `brightness` | `number \| string` | All |
| `opacity` | `number \| string` | All |
| `blur` | `number \| string` | Android 12+ only |
| `contrast` | `number \| string` | Android only |
| `dropShadow` | `DropShadowValue \| string` | Android 12+ only |
| `grayscale` | `number \| string` | Android only |
| `hueRotate` | `string` (e.g., `"90deg"`) | Android only |
| `invert` | `number \| string` | Android only |
| `sepia` | `number \| string` | Android only |
| `saturate` | `number \| string` | Android only |

---

## Tamagui Support Status

### ✅ Fully Supported
| Prop | Notes |
|------|-------|
| `display: 'contents'` | Already in types |

### 🟡 Partially Supported (needs type updates)
| Prop | Current State | Needed |
|------|---------------|--------|
| `boxShadow` | Works via RN ViewStyle, no token support | Add SizeTokens/ColorTokens, obj↔str conversion |
| `filter` | Typed as "web-only" | Remove web-only, add proper types |
| `mixBlendMode` | Typed as "web-only" | Remove web-only comment |
| `outline*` | Typed as "web-only" | Remove web-only, add SpaceTokens |
| `boxSizing` | Typed as "web-only" | Remove web-only comment |
| `cursor` | Typed as "web-only" | Update for iOS 17+ support |

### ❌ Missing
| Prop | Notes |
|------|-------|
| `isolation` | Not in types at all |

---

## Implementation Tasks

### 1. Type Updates (`code/core/web/src/types.tsx`)

- [ ] Add `isolation?: 'auto' | 'isolate'` prop
- [ ] Update `boxSizing` - remove "web-only" comment
- [ ] Update `cursor` - change comment to "iOS 17+ / Web"
- [ ] Update `filter` - remove "web-only", add proper object array type
- [ ] Update `mixBlendMode` - remove "web-only" comment
- [ ] Update `outline*` props - remove "web-only" comments, ensure ColorTokens/SpaceTokens
- [ ] Add `BoxShadowValue` type with token support
- [ ] Add `FilterFunction` type with token support

### 2. Runtime Conversions

- [ ] Native: boxShadow string → object array (in stash@{0})
- [ ] Native: boxShadow object token resolution (in stash@{0})
- [ ] Web: boxShadow object → CSS string
- [ ] Native: filter string → object array
- [ ] Web: filter object → CSS string

### 3. Tests Needed

- [ ] Type tests for all new props
- [ ] Compiler tests for token resolution
- [ ] Integration tests (web + native)
- [ ] Visual manual testing

---

## Token Support Requirements

Props that should support Tamagui tokens:

| Prop | Token Type |
|------|------------|
| `boxShadow.offsetX/Y` | SizeTokens |
| `boxShadow.blurRadius` | SizeTokens |
| `boxShadow.spreadDistance` | SizeTokens |
| `boxShadow.color` | ColorTokens |
| `filter.blur` | SizeTokens |
| `filter.dropShadow.*` | SizeTokens/ColorTokens |
| `outlineWidth` | SpaceValue (already) |
| `outlineOffset` | SpaceValue (already) |
| `outlineColor` | ColorTokens (needs update) |

---

## Sources

- [React Native 0.77 Release](https://reactnative.dev/blog/2025/01/21/version-0.77)
- [React Native 0.82 Release](https://reactnative.dev/blog/2025/10/08/react-native-0.82)
- [React Native 0.83 Release](https://reactnative.dev/blog/2025/12/10/react-native-0.83)
- [View Style Props](https://reactnative.dev/docs/view-style-props)
- [BoxShadowValue](https://reactnative.dev/docs/boxshadowvalue)
