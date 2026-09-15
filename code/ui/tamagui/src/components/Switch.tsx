import {
  createSwitch,
  SwitchFrame as SwitchBehaviorFrame,
  SwitchThumbFrame as SwitchBehaviorThumbFrame,
} from '@tamagui/switch'
import { type GetProps, resolveSizing, type SizeName, styled } from '@tamagui/core'

export type SwitchSize = SizeName | boolean

// the track is the checkbox square stretched into a pill (1.9 wide), so a
// switch and a checkbox at the same size read as the same weight (the height
// derives from the same square as Checkbox.tsx). the thumb insets by the
// track's 2px padding on every side.
const switchTrackSize = styled.dynamic<SwitchSize>((val, env) => {
  const height = resolveSizing(val, env).square
  return { width: Math.round(height * 1.9), height, minHeight: height }
})

const THUMB_INSET = 2

const switchThumbSize = styled.dynamic<SwitchSize>((val, env) => {
  const side = resolveSizing(val, env).square - THUMB_INSET * 2
  return { width: side, height: side }
})

export const SwitchFrame = styled(SwitchBehaviorFrame, {
  displayName: 'Switch',
  borderRadius: 1000,
  padding: THUMB_INSET,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: switchTrackSize,

    // off is a low-contrast trough the page barely registers. on swaps the whole
    // control onto the brand theme, so `background` here is the inverse fill and
    // the thumb's `color` is the matching foreground.
    active: {
      true: { backgroundColor: 'background' },
      false: { backgroundColor: 'color-4 hover:color-5' },
    },

    disabled: {
      true: { cursor: 'not-allowed', opacity: 0.45 },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const SwitchThumbFrame = styled(SwitchBehaviorThumbFrame, {
  displayName: 'SwitchThumb',
  borderRadius: 1000,
  boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
  variants: {
    size: switchThumbSize,

    // the knob stays the light one against the trough in both schemes, and
    // becomes the brand foreground once the track flips to the brand fill.
    active: {
      true: { backgroundColor: 'color' },
      false: { backgroundColor: 'white' },
    },
  } as const,
  defaultVariants: {
    size: 'md',
  },
})

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumbFrame,
  activeTheme: 'brand',
})

export const SwitchThumb = Switch.Thumb

export type SwitchProps = GetProps<typeof Switch>
