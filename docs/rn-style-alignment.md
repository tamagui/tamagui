# React Native Style Alignment (0.76 - 0.83)

This document tracks Tamagui's alignment with React Native's new CSS-like style props introduced in versions 0.76-0.83.

**Last Updated:** 2026-01-16
**Manual Test Count:** 5 sessions completed via Playwright headless browser
**Automated Test Coverage:** ✅ All 39 RN style alignment tests pass (20 web + 19 native)

### Manual Test Session Results:
- Session 1: Page loading verification ✅
- Session 2: 9 CSS style prop tests - ALL PASSED ✅
- Session 3: Visual quality checks ✅
- Session 4: 19 comprehensive style tests - ALL PASSED ✅
- Session 5: 7 token value tests + 16 mixBlendMode values - ALL PASSED ✅

## Summary of New RN Style Props by Version

### RN 0.76 (October 2024) - New Architecture Default
| Prop | Type | Platform | Notes |
|------|------|----------|-------|
| `boxShadow` | `BoxShadowValue[] \| string` | iOS, Android 9+ (New Arch) | Full CSS-like shadow support |
| `filter` | `FilterFunction[] \| string` | Partial (New Arch) | Graphical filters |
| `cursor` | `'auto' \| 'pointer'` | iOS 17+ | Hover effects for trackpad/stylus |

### RN 0.77 (January 2025)
| Prop | Type | Platform | Notes |
|------|------|----------|-------|
| `display: 'contents'` | enum value | All (New Arch) | Element disappears from layout, children render as parent's direct children |
| `boxSizing` | `'border-box' \| 'content-box'` | All (New Arch) | Controls how width/height are calculated |
| `mixBlendMode` | 16 blend modes | All (New Arch) | Controls color blending with stacking context |
| `isolation` | `'auto' \| 'isolate'` | All (New Arch) | Forces stacking context for mixBlendMode |
| `outlineWidth` | number | All (New Arch) | Outline width (doesn't affect layout) |
| `outlineStyle` | `'none' \| 'solid' \| 'dotted' \| 'dashed'` | All (New Arch) | Outline style |
| `outlineColor` | color | All (New Arch) | Outline color |
| `outlineOffset` | number | All (New Arch) | Space between outline and element |

### RN 0.79 (April 2025)
- Enforced CSS-compliant units in boxShadow/filter (`1px 1px black` not `1 1 black`)

### RN 0.82 (October 2025)
- New Architecture only (old arch deprecated)
- DOM-like Node APIs via refs

### RN 0.83 (December 2025)
- No breaking changes
- Animation backend support for all style props

---

## Tamagui Support Status

### ✅ Fully Supported (as of 2026-01-16)
| Prop | Notes |
|------|-------|
| `boxShadow` | Object/array format with token support (SpaceTokens, ColorTokens) |
| `filter` | Object/array format with token support |
| `mixBlendMode` | All 16 blend modes |
| `isolation` | `'auto' \| 'isolate'` |
| `boxSizing` | `'border-box' \| 'content-box'` |
| `outlineWidth` | SpaceValue tokens supported |
| `outlineStyle` | `'none' \| 'solid' \| 'dotted' \| 'dashed'` |
| `outlineColor` | ColorTokens supported |
| `outlineOffset` | SpaceValue tokens supported |
| `display: 'contents'` | Passes through correctly |
| `cursor` | Supported on iOS 17+ / Web |

---

## BoxShadowValue Object Type

```typescript
interface BoxShadowObject {
  offsetX: SpaceTokens | number | string;
  offsetY: SpaceTokens | number | string;
  blurRadius?: SpaceTokens | number | string;
  spreadDistance?: SpaceTokens | number | string;
  color?: ColorStyleProp | string;
  inset?: boolean;
}

type BoxShadowValue = BoxShadowObject | BoxShadowObject[] | string;
```

**String format:** `"offsetX offsetY [blurRadius] [spreadDistance] [color] [inset]"`
- Example: `"10px 5px 15px 0px rgba(0,0,0,0.5)"`
- Example: `"inset 0px 2px 4px black"`

**Behavior by platform:**
- **Web:** Converted to CSS string (`box-shadow: 5px 5px 10px red`)
- **Native:** Kept as object array for RN 0.76+ format

---

## Filter Functions

| Function | Type | Platform |
|----------|------|----------|
| `brightness` | `number \| \`${number}%\`` | All |
| `opacity` | `number \| \`${number}%\`` | All |
| `blur` | `SpaceTokens \| number \| string` | Android 12+ only |
| `contrast` | `number \| \`${number}%\`` | Android only |
| `dropShadow` | `DropShadowValue` | Android 12+ only |
| `grayscale` | `number \| \`${number}%\`` | Android only |
| `hueRotate` | `\`${number}deg\` \| \`${number}rad\`` | Android only |
| `invert` | `number \| \`${number}%\`` | Android only |
| `sepia` | `number \| \`${number}%\`` | Android only |
| `saturate` | `number \| \`${number}%\`` | Android only |

```typescript
type FilterFunction =
  | { brightness: number | `${number}%` }
  | { opacity: number | `${number}%` }
  | { blur: SpaceTokens | number | string }
  | { contrast: number | `${number}%` }
  | { grayscale: number | `${number}%` }
  | { hueRotate: `${number}deg` | `${number}rad` }
  | { invert: number | `${number}%` }
  | { saturate: number | `${number}%` }
  | { sepia: number | `${number}%` }
  | { dropShadow: { offsetX, offsetY, blurRadius?, color? } }

type FilterValue = FilterFunction | FilterFunction[] | string;
```

**Behavior by platform:**
- **Web:** Converted to CSS string (`filter: brightness(1.2) blur(5px)`)
- **Native:** Kept as object array for RN 0.76+ format

---

## Test Coverage

### Web Tests (`rnStyleAlignment.web.test.tsx`) - 20 tests
- boxShadow: string, object, array, tokens, inset, spreadDistance
- filter: string, object, array, tokens, dropShadow
- mixBlendMode, isolation, boxSizing, outline props, display contents

### Native Tests (`rnStyleAlignment.native.test.tsx`) - 19 tests
- boxShadow: object array format, token resolution, inset, spreadDistance, string parsing
- filter: object array format, token resolution, dropShadow, string parsing
- mixBlendMode, isolation, boxSizing, outline props, display contents

---

## Implementation Details

### Key Files Modified
- `code/core/helpers/src/webOnlyStyleProps.ts` - Removed RN 0.77+ props from web-only list
- `code/core/helpers/src/validStyleProps.ts` - Added new props to valid style props list
- `code/core/web/src/types.tsx` - Added proper types with token support
- `code/core/web/src/helpers/propMapper.native.ts` - Token resolution for boxShadow/filter
- `code/core/web/src/helpers/expandStyle.native.ts` - String→object parsing for native

### Token Resolution
On native, tokens like `$2` and `$white` in boxShadow/filter objects are resolved:
- Size tokens → numeric values
- Color tokens → color strings

On web, tokens are resolved to CSS variables.

---

## Sources

- [React Native 0.76 Release](https://reactnative.dev/blog/2024/10/23/release-0.76-new-architecture)
- [React Native 0.77 Release](https://reactnative.dev/blog/2025/01/21/version-0.77)
- [React Native 0.82 Release](https://reactnative.dev/blog/2025/10/08/react-native-0.82)
- [React Native 0.83 Release](https://reactnative.dev/blog/2025/12/10/react-native-0.83)
- [View Style Props](https://reactnative.dev/docs/view-style-props)
