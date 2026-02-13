# Flat Mode Implementation Plan

## Current Tamagui Modifier Support

### SUPPORTED TODAY (object syntax)
```tsx
// Single modifiers
backgroundColor: 'red'           // base style
hoverStyle: { bg: 'red' }        // pseudo
$sm: { bg: 'red' }               // media
$theme-dark: { bg: 'black' }     // theme
$platform-web: { cursor: 'pointer' } // platform

// Media wrapping pseudo (SUPPORTED)
$sm: { hoverStyle: { bg: 'red' } }
$theme-dark: { hoverStyle: { bg: 'black' } }

// Nested platform inside media (SUPPORTED)
$sm: { $platform-web: { cursor: 'pointer' } }
```

### NOT SUPPORTED TODAY (to be added)
```tsx
// Chained media queries - NOT YET SUPPORTED
$sm: { $theme-dark: { bg: 'black' } }  // media + theme chain
$theme-dark: { $sm: { bg: 'black' } }  // theme + media chain
```

## Flat Mode Syntax Mapping

### Phase 1: Basic (existing combinations)
```tsx
// Base props
$bg="red"                    → { backgroundColor: 'red' }
$bg="$red"                   → { backgroundColor: '$red' }

// Pseudo
$hover:bg="red"              → { hoverStyle: { backgroundColor: 'red' } }
$press:opacity={0.5}         → { pressStyle: { opacity: 0.5 } }

// Media
$sm:bg="red"                 → { $sm: { backgroundColor: 'red' } }

// Media + Pseudo (SUPPORTED - media wraps pseudo)
$sm:hover:bg="red"           → { $sm: { hoverStyle: { backgroundColor: 'red' } } }
$hover:sm:bg="red"           → { $sm: { hoverStyle: { backgroundColor: 'red' } } }  // order independent

// Theme
$dark:bg="black"             → { '$theme-dark': { backgroundColor: 'black' } }
$dark:hover:bg="gray"        → { '$theme-dark': { hoverStyle: { backgroundColor: 'gray' } } }

// Platform
$web:cursor="pointer"        → { '$platform-web': { cursor: 'pointer' } }
```

### Phase 2: Chained Media (NEW - to be added)
```tsx
// Chained media + theme
$sm:dark:bg="black"          → { $sm: { '$theme-dark': { backgroundColor: 'black' } } }
$dark:sm:bg="black"          → { $sm: { '$theme-dark': { backgroundColor: 'black' } } }  // same result

// Full chain: media + theme + pseudo
$sm:dark:hover:bg="gray"     → { $sm: { '$theme-dark': { hoverStyle: { backgroundColor: 'gray' } } } }
```

## Token Handling

Tokens (`$red`, `$blue`, etc.) go to `rulesToInsert` as CSS classes, NOT to `style`:
- Literal values: `$bg="red"` → `style: { backgroundColor: 'red' }`
- Token values: `$bg="$red"` → `rulesToInsert: { ... }` (CSS class)

## Test Strategy

1. **Base props with literals** - check `style`
2. **Base props with tokens** - check `rulesToInsert`
3. **Pseudo modifiers** - check `classNames` contains pseudo key
4. **Media modifiers** - check `classNames` contains media key
5. **Combined modifiers** - check `classNames` contains both keys
6. **Skip chained media tests** until Phase 2 implementation

## Implementation Steps

1. ✅ Add `preprocessFlatProps()` to getSplitStyles
2. ✅ Parse `$modifier:prop` syntax
3. ✅ Transform to nested object format
4. ✅ Fix tests to check correct output locations
5. ✅ 26 unit tests passing (flatMode.web.test.tsx)
6. ✅ 12 integration tests passing (kitchen-sink/tests/FlatMode.test.tsx)
7. ⬜ Add chained media support to main loop (Phase 2)
8. ⬜ Add types for flat props

## Current Test Coverage

### Unit Tests (26 tests)

- Base props: `$bg`, `$p`, `$color`, `$opacity`
- Pseudo modifiers: `$hover:bg`, `$press:opacity`, `$focus:borderColor`, `$disabled:opacity`
- Media modifiers: `$sm:bg`, `$md:p`
- Combined modifiers: `$sm:hover:bg`, `$hover:sm:bg` (order independent)
- Theme modifiers: `$dark:bg`, `$light:color`
- Platform modifiers: `$web:cursor`
- Token values: `$bg="$white"`, `$hover:bg="$black"`
- Shorthands: `$m`, `$rounded`, `$w`, `$h`
- Styled components with flat props
- Multiple flat props together
- Mixed flat and object syntax

### Integration Tests (12 tests)

- Base props rendering
- Token resolution with CSS variables
- Hover state (base + hovered)
- Press state (base + pressed)
- Media syntax matching regular syntax
- Combined modifiers structure
- Platform modifiers (web cursor)
- Styled components with flat props
- Mixed flat and object syntax
- Multiple flat props together

## Files Changed

- `/code/core/web/src/helpers/getSplitStyles.tsx` - Added preprocessing
- `/code/core/core-test/flatMode.web.test.tsx` - Unit test suite
- `/code/kitchen-sink/src/usecases/FlatMode.tsx` - Integration test use case
- `/code/kitchen-sink/tests/FlatMode.test.tsx` - Integration test suite
- `/code/kitchen-sink/src/usecases/index.web.ts` - Added FlatMode export
