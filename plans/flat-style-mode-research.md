# Flat Style Mode - Technical Research

Deep dive findings from analyzing Tamagui internals for implementing `styleMode: 'flat'`.

## Key Architectural Insights

### 1. Type System Challenges

**Current template literal patterns:**
```typescript
MediaPropKeys = `$${MediaQueryKey}`           // $sm, $md
ThemeMediaKeys = `$theme-${ThemeName}`        // $theme-dark
PlatformMediaKeys = `$platform-${Platform}`   // $platform-web
GroupMediaKeys = `$group-${Name}-${State}`    // $group-header-hover
```

**Challenge with colons:**
- TypeScript requires quoted keys for colons: `'$hover:bg': string`
- Current patterns use hyphens, not colons
- JSX allows unquoted colons, but `styled()` object syntax doesn't

**Potential solutions:**
1. Use hyphens instead: `$hover-bg` (consistent with existing patterns)
2. Accept quoted keys in `styled()`: `'$hover:bg'`
3. Use template literal types with escape: `` `$${Pseudo}:${Prop}` ``

### 2. Prop Processing Pipeline

**Entry point:** `getSplitStyles()` in `code/core/web/src/helpers/getSplitStyles.tsx`

**Main loop decision tree (lines 282-1044):**
```
for (keyInit in props):
  1. Skip children, className
  2. Expand shorthands (keyInit = shorthands[keyInit] || keyInit)
  3. Check isValidStyleKey (CSS property)
  4. Check isPseudo (keyInit in validPseudoKeys)
  5. Check isMedia (getMediaKey(keyInit))
  6. Check isVariant (keyInit in variants)
  7. Route to appropriate handler:
     - Style → mergeStyle()
     - Pseudo → getSubStyle() + pseudo processing
     - Media → getSubStyle() + media processing
     - Variant → continue (variant already expanded)
     - Other → viewProps (pass through)
```

**Key insight:** Flat mode would need to intercept BEFORE step 3-6 to parse the `$modifier:prop` syntax and route appropriately.

### 3. Media Key Detection

**File:** `code/core/web/src/hooks/useMedia.tsx`

```typescript
const mediaKeyRegex = /\$(platform|theme|group)-/

export const getMediaKey = (key: string): IsMediaType => {
  if (key[0] !== '$') return false
  if (mediaKeys.has(key)) return true  // $sm, $md registered at config
  const match = key.match(mediaKeyRegex)
  if (match) return match[1] as 'platform' | 'theme' | 'group'
  return false
}
```

**Extension needed:** Add new regex/detection for `$modifier:prop` pattern.

### 4. Pseudo Descriptors

**File:** `code/core/web/src/helpers/pseudoDescriptors.ts`

```typescript
pseudoDescriptorsBase = {
  hoverStyle:        { name: 'hover',         priority: 2 }
  pressStyle:        { name: 'active',        priority: 3, stateKey: 'press' }
  focusVisibleStyle: { name: 'focus-visible', priority: 4, stateKey: 'focusVisible' }
  focusStyle:        { name: 'focus',         priority: 4 }
  focusWithinStyle:  { name: 'focus-within',  priority: 4, stateKey: 'focusWithin' }
  disabledStyle:     { name: 'disabled',      priority: 5, stateKey: 'disabled' }
  enterStyle:        { name: 'enter',         priority: 4, selector: '.t_unmounted' }
  exitStyle:         { name: 'exit',          priority: 5 }
}
```

**Mapping needed:** `$hover` → `hoverStyle`, `$press` → `pressStyle`, etc.

### 5. Importance/Priority System

**Hierarchy (lowest to highest):**
1. Base styles: importance = 1
2. Pseudo styles: importance = 2-5 (from descriptor.priority)
3. Media styles: importance = 100+ (from config order)

**In mergeStyle():**
```typescript
const existingImportance = usedKeys[key] || 0
if (existingImportance > importance) return  // Don't override
usedKeys[key] = importance
styleState.style[key] = val
```

### 6. Compiler Considerations

**Current compiler flow:**
1. Parse JSX attributes via `evaluateAttribute()`
2. Validate against known keys (validStyles, pseudoDescriptors, shorthands, variants)
3. Generate atomic CSS classes
4. Output flattened className props

**Challenge:** Compiler needs to know ALL valid prop names ahead of time. Dynamic patterns like `$hover:bg` require:
- New validation logic in `isValidStyleKey()`
- New parsing in `evaluateAttribute()`
- Proper ternary/media generation

### 7. Shorthand System

**File:** `code/core/shorthands/src/v5.ts`

```typescript
shorthands = {
  bg: 'backgroundColor',
  p: 'padding',
  m: 'margin',
  rounded: 'borderRadius',
  // ... 30+ more
}
```

**Expansion happens early** in getSplitStyles (line 314-318):
```typescript
if (keyInit in shorthands) {
  keyInit = shorthands[keyInit]
}
```

### 8. CSS Generation

**Atomic CSS for pseudos:**
```css
/* hoverStyle: { backgroundColor: 'red' } */
:root ._bg-0hover-abc123:hover { background-color: red !important; }

/* pressStyle: { opacity: 0.5 } */
:root :root ._opacity-0active-def456:active { opacity: 0.5 !important; }
```

**Specificity via `:root` prefixes:**
- More `:root` = higher specificity
- Later-defined = more `:root` prefixes
- Pseudos get `!important` for cascade control

### 9. Runtime State Management

**Component state (useComponentState):**
```typescript
defaultComponentState = {
  unmounted: true,
  disabled: false,
  press: false,
  pressIn: false,
  hover: false,
  focus: false,
  focusVisible: false,
  focusWithin: false,
}
```

**Event binding (createComponent.tsx):**
- `onMouseEnter` → `hover: true`
- `onMouseLeave` → `hover: false`
- `onPressIn` → `press: true, pressIn: true`
- `onPress` → `press: false, pressIn: false`
- `onFocus` → `focus: true` (or `focusVisible` if keyboard)
- `onBlur` → `focus: false, focusVisible: false`

---

## Implementation Strategy

### Phase 1: Parser Layer

Add new parsing before the main prop loop in `getSplitStyles`:

```typescript
// New function to parse flat mode props
function parseFlatProp(key: string, config: TamaguiConfig): ParsedFlatProp | null {
  if (key[0] !== '$') return null
  if (!config.settings?.styleMode === 'flat') return null

  const parts = key.slice(1).split(':')
  if (parts.length === 1) {
    // $bg → shorthand style prop
    const prop = config.shorthands[parts[0]] || parts[0]
    return { type: 'style', prop }
  }

  // $hover:bg or $sm:bg or $sm:hover:bg
  const lastPart = parts[parts.length - 1]
  const prop = config.shorthands[lastPart] || lastPart
  const modifiers = parts.slice(0, -1)

  return parseModifiers(modifiers, prop)
}
```

### Phase 2: Type Generation

Generate types for flat mode props:

```typescript
// In types.tsx
type FlatStyleProps<S extends CreateShorthands> = {
  [K in keyof S as `$${K}`]?: S[K] extends keyof StyleProps ? StyleProps[S[K]] : never
}

type FlatPseudoProps<S extends CreateShorthands, P extends PseudoState> = {
  [K in keyof S as `$${P}:${K}`]?: S[K] extends keyof StyleProps ? StyleProps[S[K]] : never
}

type FlatMediaProps<S extends CreateShorthands, M extends MediaQueryKey> = {
  [K in keyof S as `$${M}:${K}`]?: S[K] extends keyof StyleProps ? StyleProps[S[K]] : never
}

// Combined
type WithFlatModeProps<StyleProps> =
  FlatStyleProps<Shorthands> &
  FlatPseudoProps<Shorthands, 'hover'> &
  FlatPseudoProps<Shorthands, 'press'> &
  // ... etc
```

### Phase 3: Integration Points

1. **getSplitStyles.tsx** - Main parsing loop
2. **propMapper.ts** - Value expansion (tokens, variants)
3. **getCSSStylesAtomic.ts** - CSS class generation
4. **createMediaStyle.ts** - Media query wrapping
5. **useMedia.tsx** - Runtime media detection
6. **createComponent.tsx** - Event binding for pseudos

### Phase 4: Compiler Support

1. **evaluateAttribute()** - Parse `$hover:bg` syntax
2. **isValidStyleKey()** - Validate flat mode props
3. **extractToClassNames()** - Generate correct atomic classes

### Key Insight: All Combinations Are Known

There are NO dynamic patterns. All valid flat props are enumerable at config time:

**Finite sets:**
- Shorthands: ~30 (bg, p, m, rounded, etc.)
- Pseudos: 8 (hover, press, focus, focus-visible, focus-within, disabled, enter, exit)
- Media: ~10 (sm, md, lg, xl, xxl, xs, xxs, xxxs, max-* variants)
- Platforms: 4 (web, native, ios, android)
- Themes: from config (typically dark, light)

**Total combinations:**
- Base: ~30 (`$bg`, `$p`, etc.)
- Pseudo: ~240 (30 × 8)
- Media: ~300 (30 × 10)
- Media + Pseudo: ~2400 (30 × 10 × 8)
- Theme + Media + Pseudo: ~4800

This means:
1. **Types** - Exact union types, full autocomplete
2. **Compiler** - Static validation, no runtime parsing
3. **Performance** - Can pre-compute valid key set at config time

---

## Open Questions

1. **Separator character:** `:` vs `-`
   - `:` matches Tailwind but needs quotes in `styled()`
   - `-` is JS-friendly but less visually distinct

2. **Modifier order:** Does order matter?
   - `$sm:hover:bg` vs `$hover:sm:bg`
   - Tailwind: responsive first (`sm:hover:`)
   - Should we enforce or allow either?

3. **Token syntax in flat mode:**
   - `$bg="$blue5"` - value is token
   - How to distinguish `$` in key vs value?

4. **Backwards compatibility:**
   - Can flat mode coexist with object syntax?
   - `$bg="red"` alongside `$sm={{ bg: 'red' }}`?

5. **Group syntax:**
   - `$group-header:hover:bg` or `$group-header-hover:bg`?
   - Current: `$group-header-hover` (all hyphens)

---

## File References

| File | Purpose |
|------|---------|
| `web/src/helpers/getSplitStyles.tsx` | Main prop processing (1659 lines) |
| `web/src/helpers/propMapper.ts` | Token/variant/shorthand expansion |
| `web/src/helpers/pseudoDescriptors.ts` | Pseudo definitions |
| `web/src/helpers/getCSSStylesAtomic.ts` | CSS generation |
| `web/src/helpers/createMediaStyle.ts` | Media query CSS |
| `web/src/hooks/useMedia.tsx` | Runtime media state |
| `web/src/createComponent.tsx` | Component factory |
| `web/src/types.tsx` | Type definitions (2600+ lines) |
| `shorthands/src/v5.ts` | Shorthand mappings |
| `static/src/extractor/createExtractor.ts` | Compiler extraction |
