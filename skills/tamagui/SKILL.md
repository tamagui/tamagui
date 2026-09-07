---
name: tamagui
description: Universal React UI framework for web and native with flat conditional values. Use when building cross-platform apps with Tamagui, writing styled components, or applying tokens, themes, animations, and media queries.
metadata:
  version: 3.0.0
---

# Tamagui Skill

Universal React UI framework for web and native. In v3, conditions are flat clauses in the style value, tokens and themes are bare names, and nested condition props such as `hoverStyle` are removed.

## 1. Project Configuration First

Before writing Tamagui code, generate or read the project prompt:

```bash
npx tamagui generate-prompt
```

This writes `tamagui-prompt.md` containing the project's exact token names, theme keys, media breakpoints, shorthands, and components. In an existing app, always inspect and use the project's local component wrappers first before importing from raw packages.

## 2. Flat Value Grammar

Every conditional style value follows this grammar:

```txt
value  := base? clause*
clause := modifier(:modifier)*:payload
```

- Modifiers chain left-to-right: `dark:hover:navy` applies when both dark and hover match.
- Payloads extend to the next top-level clause or end of string.
- An empty payload is invalid. Clear a property with `none`, `transparent`, `initial`, or `unset`.
- Do not author raw `transform` strings with clauses; use atomic transform props (`scale`, `rotate`, `x`, `y`).

### Supported Modifiers

- Interaction: `hover:`, `press:`, `focus:`, `focus-visible:`, `focus-within:`, `disabled:`
- Media: configured keys such as `sm:` (min-width), `max-sm:` (max-width), `md:`, `max-md:`
- Theme: `dark:`, `light:`, and configured theme names
- Platform: `web:`, `native:`, `ios:`, `android:`
- Group: `group-hover:`, `group-hover/name:`, `group-press/name:`
- Container: `@sm:`, `@sm/name:` (measures nearest query container)
- Presence: `enter:`, `exit:` (requires `transition=`)

### Rules

1. **No `$` sigil**: tokens and theme names are bare: `bg="background"`, `p="4"`, not `bg="$background"`.
2. **Kebab theme names**: built-in theme keys use kebab-case: `background-hover`, `background-press`, `border-color`, `border-color-hover`, `placeholder-color`, `shadow-color`.
3. **Numbers are px**: a quoted number string `p="4"` resolves the configured space token. A raw numeric literal `p={4}` is literal 4px on web or 4 points on native.
4. **Specificity precedence ladder**: when multiple clauses match, the winner is decided by specificity, not authored order:
   - Platform rank (`ios:` > `native:` > bare)
   - Condition count (more conditions win)
   - Category rank: media (1) < container (65) < theme (129) < group (161) < state (225)
   - Authored order breaks exact ties only.
   - A chain supports at most five distinct non-platform conditions.

## 3. Style Value Syntax

Tamagui supports both string and object syntax. Projects can configure `settings.styleValueSyntax` to enforce one form.

### String Form

```tsx
import { View } from 'tamagui'

export function Demo() {
  return (
    <View
      bg="background hover:background-hover dark:blue-500"
      p="4 sm:6 max-sm:2"
      w="100% md:50%"
      opacity="web:0.9"
      scale="1 enter:0.9 exit:0.9"
      transition="quick"
    />
  )
}
```

### Object Form

```tsx
import { View } from 'tamagui'

export function Demo() {
  return (
    <View
      bg={{ default: 'background', hover: 'background-hover', dark: 'blue-500' }}
      p={{ default: '4', sm: '6', 'max-sm': '2' }}
      w={{ default: '100%', md: '50%' }}
      opacity={{ web: 0.9 }}
      scale={{ default: 1, enter: 0.9, exit: 0.9 }}
      transition="quick"
    />
  )
}
```

## 4. Shorthands vs Longhands

Check `onlyAllowShorthands` in `tamagui-prompt.md`. Under stock v6 it is `true`, meaning longhand property names are removed from types and will cause type errors. Always author using shorthands:

- `p`, `px`, `py`, `pt`, `pb`, `pl`, `pr`: padding
- `m`, `mx`, `my`, `mt`, `mb`, `ml`, `mr`: margin
- `w`, `h`, `minW`, `maxW`, `minH`, `maxH`: dimensions
- `bg`: background
- `color`: text color (unshortened in v6)
- `rounded`: border radius
- `items`: align items
- `justify`: justify content

## 5. Control Sizes

With the v6 config, controls (Button, Input, Select, etc.) accept named sizes: `xs`, `sm`, `md`, `lg`, `xl`. The default is `md`.

```tsx
import { Button, YStack } from 'tamagui'

export function Buttons() {
  return (
    <YStack gap="2">
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
    </YStack>
  )
}
```

Use named recipes for control sizes. Legacy token keys such as `size="4"` remain supported, but use the old height-based sizing model. `Spinner` has its own `small` and `large` sizes.

## 6. Groups and Containers

Declare `group` and `container` as props on the parent, then target them in children:

```tsx
import { Text, View } from 'tamagui'

export function CardGroup() {
  return (
    <View group="card" container="card">
      <Text color="color group-hover/card:color-focus @sm/card:color">Card title</Text>
    </View>
  )
}
```

## 7. Animations and Presence

The v3 animation prop is `transition` (not `animation`). For enter and exit transitions, specify `enter:` and `exit:` clauses and wrap unmounting components in `AnimatePresence` with an explicit `key`:

```tsx
import { AnimatePresence, View } from 'tamagui'

export function Fade({ visible }: { visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <View
          key="fade-box"
          opacity="1 enter:0 exit:0"
          scale="1 enter:0.9 exit:0.9"
          transition="quick"
        />
      )}
    </AnimatePresence>
  )
}
```

## 8. Removed V2 APIs and Replacements

| V2 API | V3 Replacement |
|---|---|
| `hoverStyle={{ ... }}` | `bg="background hover:background-hover"` or `bg={{ hover: '...' }}` |
| `pressStyle={{ ... }}` | `press:` clause: `scale="1 press:0.95"` |
| `focusStyle={{ ... }}` | `focus:` clause |
| `enterStyle={{ ... }}` / `exitStyle={{ ... }}` | `enter:` / `exit:` clauses with `transition="preset"` |
| `animation="fast"` | `transition="fast"` |
| `$sm={{ ... }}` | `sm:` clause in style prop: `p="2 sm:4"` |
| `Sheet.Frame` | `Sheet.Container` and `Sheet.Background` |
| `Component.styleable(fn)` | `createStyledHOC(Component, fn)` |
| `useProps`, `useStyle` | `splitStyleProps`, `getExpandedShorthand` |
| `Select.Item index={i}` | `index` prop removed; use `<Select.Item value="val">` |

## 9. Packages to Import

- `tamagui`: styled components with skins (Button, Input, Dialog, Sheet, etc.)
- `tamagui/unstyled` (`@tamagui/ui`): unstyled primitives with structural styles only
- `@tamagui/core`: core styling runtime (`View`, `Text`, `styled`)
- `html.*`: DOM elements with Tamagui flat value support (`html.div`, `html.span`)

## 10. Verification

Verify styles and syntax with:

```bash
npx tamagui check --strict
```

`settings.allowedStyleValues` controls type validation of single-token values. Conditional payloads and modifiers also need `tamagui check --strict`, which loads the project config on a fresh project.

For detailed APIs, read [configuration](references/configuration.md), [components](references/components.md), and [animations](references/animations.md).
