# Animations Reference

## Animation Drivers

Tamagui supports multiple animation drivers. Choose based on your platform:

| Driver | Package | Best For |
|--------|---------|----------|
| CSS | `@tamagui/animations-css` | Web-only apps, smallest bundle |
| React Native | `@tamagui/animations-react-native` | Native apps, basic animations |
| Reanimated | `@tamagui/animations-reanimated` | Native apps, best performance |
| Motion | `@tamagui/animations-motion` | Cross-platform spring physics |

## Configuration

```tsx
// v5 config - import driver separately
import { defaultConfig } from '@tamagui/config/v5'
import { animations } from '@tamagui/config/v5-css'
// or: '@tamagui/config/v5-motion'
// or: '@tamagui/config/v5-rn'
// or: '@tamagui/config/v5-reanimated'

export const config = createTamagui({
  ...defaultConfig,
  animations,
})
```

## Defining Animations

### CSS Driver

Uses CSS transition strings:

```tsx
import { createAnimations } from '@tamagui/animations-css'

const animations = createAnimations({
  fast: 'ease-in 150ms',
  medium: 'ease-in-out 300ms',
  slow: 'ease-out 500ms',
  bouncy: 'cubic-bezier(0.68, -0.55, 0.265, 1.55) 400ms',
})
```

### Spring-Based Drivers (RN, Reanimated, Motion)

Use spring physics config:

```tsx
import { createAnimations } from '@tamagui/animations-react-native'

const animations = createAnimations({
  fast: {
    type: 'spring',
    damping: 20,
    stiffness: 300,
  },
  medium: {
    type: 'spring',
    damping: 15,
    stiffness: 200,
  },
  bouncy: {
    type: 'spring',
    damping: 8,
    mass: 0.8,
    stiffness: 100,
  },
})
```

## Using Animations

### Basic Animation

```tsx
<View
  animation="medium"
  opacity={isVisible ? 1 : 0}
  y={isVisible ? 0 : 10}
/>
```

### Enter/Exit Styles

```tsx
<View
  animation="fast"
  enterStyle={{
    opacity: 0,
    y: -20,
    scale: 0.9,
  }}
  exitStyle={{
    opacity: 0,
    y: 20,
    scale: 0.9,
  }}
  opacity={1}
  y={0}
  scale={1}
/>
```

### AnimatePresence (Required for Exit)

Exit animations only work inside `AnimatePresence`:

```tsx
import { AnimatePresence } from 'tamagui'

<AnimatePresence>
  {show && (
    <View
      key="unique-key"  // key is required
      animation="medium"
      enterStyle={{ opacity: 0 }}
      exitStyle={{ opacity: 0 }}
      opacity={1}
    />
  )}
</AnimatePresence>
```

### Per-Property Animation

Override animation for specific properties:

```tsx
<View
  animation={[
    'fast',
    {
      opacity: { type: 'timing', duration: 500 },
      scale: { overshootClamping: true },
    },
  ]}
  opacity={1}
  scale={1}
/>
```

## Animatable Properties

Common animatable style properties:
- `opacity`
- `x`, `y` (translateX/Y)
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `width`, `height`
- `backgroundColor`
- `borderColor`
- `borderRadius`

## Hover/Press States

State-based animations:

```tsx
<Button
  animation="fast"
  hoverStyle={{
    scale: 1.05,
    backgroundColor: '$blue9',
  }}
  pressStyle={{
    scale: 0.95,
    backgroundColor: '$blue11',
  }}
/>
```

## Animation with Variants

```tsx
const AnimatedCard = styled(View, {
  animation: 'medium',

  variants: {
    visible: {
      true: {
        opacity: 1,
        y: 0,
      },
      false: {
        opacity: 0,
        y: 20,
      },
    },
  } as const,
})

<AnimatedCard visible={isVisible} />
```

## Common Patterns

### Fade In

```tsx
<View
  animation="medium"
  enterStyle={{ opacity: 0 }}
  opacity={1}
/>
```

### Slide Up

```tsx
<View
  animation="fast"
  enterStyle={{ opacity: 0, y: 20 }}
  opacity={1}
  y={0}
/>
```

### Scale In

```tsx
<View
  animation="bouncy"
  enterStyle={{ opacity: 0, scale: 0.8 }}
  opacity={1}
  scale={1}
/>
```

### Modal Overlay

```tsx
<Dialog.Overlay
  animation="fast"
  enterStyle={{ opacity: 0 }}
  exitStyle={{ opacity: 0 }}
  opacity={0.5}
/>
```

### Modal Content

```tsx
<Dialog.Content
  animation={['medium', { opacity: { overshootClamping: true } }]}
  enterStyle={{ opacity: 0, y: -20, scale: 0.95 }}
  exitStyle={{ opacity: 0, y: 10, scale: 0.98 }}
  opacity={1}
  y={0}
  scale={1}
/>
```

## Tips

1. **Always provide key** in AnimatePresence children
2. **Set final values** on the component, not just in enterStyle
3. **Use overshootClamping** for opacity to prevent negative values
4. **CSS driver** doesn't support spring physics - use easing strings
5. **Test on device** - animation feel differs between web and native
