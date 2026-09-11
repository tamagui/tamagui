import {
  createSwitch,
  SwitchFrame as SwitchBehaviorFrame,
  SwitchThumbFrame as SwitchBehaviorThumbFrame,
} from '@tamagui/switch'
import { resolveSize } from '@tamagui/size'
import { type GetProps, styled } from '@tamagui/style'

// the track is the checkbox square stretched into a pill, so a switch and a
// checkbox at the same size read as the same weight (Checkbox.tsx uses the same
// 1.4). the thumb insets by the track's 2px padding on every side.
const trackHeight = (size: any, env: any) => Math.round(resolveSize(size, env).icon * 1.4)

const THUMB_INSET = 2

export const SwitchFrame = styled(SwitchBehaviorFrame, {
  displayName: 'Switch',
  borderRadius: 1000,
  padding: THUMB_INSET,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: styled.dynamic<any>((size, env) => {
      const height = trackHeight(size, env)
      return {
        width: Math.round(height * 1.9),
        height,
        minHeight: height,
      }
    }),

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
})

export const SwitchThumbFrame = styled(SwitchBehaviorThumbFrame, {
  displayName: 'SwitchThumb',
  borderRadius: 1000,
  boxShadow: '0 1px 2px rgba(0,0,0,0.18)',
  variants: {
    size: styled.dynamic<any>((size, env) => {
      const side = trackHeight(size, env) - THUMB_INSET * 2
      return {
        width: side,
        height: side,
      }
    }),

    // the knob stays the light one against the trough in both schemes, and
    // becomes the brand foreground once the track flips to the brand fill.
    active: {
      true: { backgroundColor: 'color' },
      false: { backgroundColor: 'white' },
    },
  } as const,
})

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumbFrame,
  activeTheme: 'brand',
})

export const SwitchThumb = Switch.Thumb

export type SwitchProps = GetProps<typeof Switch>
