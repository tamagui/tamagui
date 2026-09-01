import { getSize } from '@tamagui/get-token'
import {
  createSwitch,
  getVariableValue,
  type GetProps,
  type SizeTokens,
  styled,
  SwitchFrame as SwitchBehaviorFrame,
  SwitchThumbFrame as SwitchBehaviorThumbFrame,
} from '@tamagui/ui'

const getSwitchHeight = (size: SizeTokens) =>
  Math.round(getVariableValue(getSize(size)) * 0.65)

export const SwitchFrame = styled(SwitchBehaviorFrame, {
  displayName: 'Switch',
  backgroundColor: 'background',
  borderRadius: 1000,
  outlineColor: 'focus-visible:outline-color',
  outlineStyle: 'focus-visible:solid',
  outlineWidth: 'focus-visible:2px',
  variants: {
    size: styled.dynamic<SizeTokens>((size) => {
      const height = getSwitchHeight(size)
      return {
        width: height * 2,
        height,
        minHeight: height,
      }
    }),
  } as const,
})

export const SwitchThumbFrame = styled(SwitchBehaviorThumbFrame, {
  displayName: 'SwitchThumb',
  backgroundColor: 'background',
  borderRadius: 1000,
  variants: {
    size: styled.dynamic<SizeTokens>((size) => {
      const height = getSwitchHeight(size)
      return {
        width: height,
        height,
      }
    }),
  } as const,
})

export const Switch = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumbFrame,
  componentThemes: {
    frame: 'Switch',
    thumb: 'SwitchThumb',
  },
})

export const SwitchThumb = Switch.Thumb

export type SwitchProps = GetProps<typeof Switch>
