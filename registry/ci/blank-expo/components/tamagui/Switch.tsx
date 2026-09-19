import {
  createSwitch,
  SwitchFrame as SwitchBehaviorFrame,
  SwitchThumbFrame as SwitchBehaviorThumbFrame,
} from '@tamagui/switch'
import { type ComponentSize, type GetProps, styled } from '@tamagui/core'

export type SwitchSize = ComponentSize | boolean

// the track is the checkbox square stretched into a pill (1.9 wide), so a
// switch and a checkbox at the same size read as the same weight (the height
// ladder is Checkbox.tsx's). the thumb insets by the track's 2px padding on
// every side.
const switchTrackSize = {
  xs: { width: 32, height: 17, minHeight: 17 },
  sm: { width: 38, height: 20, minHeight: 20 },
  md: { width: 42, height: 22, minHeight: 22 },
  lg: { width: 48, height: 25, minHeight: 25 },
  xl: { width: 53, height: 28, minHeight: 28 },
} as const

const THUMB_INSET = 2

const switchThumbSize = {
  xs: { width: 13, height: 13 },
  sm: { width: 16, height: 16 },
  md: { width: 18, height: 18 },
  lg: { width: 21, height: 21 },
  xl: { width: 24, height: 24 },
} as const

export const SwitchFrame = styled(SwitchBehaviorFrame, {
  displayName: 'Switch',
  borderRadius: 1000,
  padding: THUMB_INSET,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: {
      ...switchTrackSize,
      true: switchTrackSize.md,
    },

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
    size: {
      ...switchThumbSize,
      true: switchThumbSize.md,
    },

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
