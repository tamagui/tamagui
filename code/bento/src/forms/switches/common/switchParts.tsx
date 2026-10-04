import { type ComponentSize, resolveSizing } from '@tamagui/core'
import {
  type ColorTokens,
  createStyledHOC,
  getVariable,
  styled,
  Switch as TamaguiSwitch,
  SwitchStyledContext,
  type SwitchProps,
  useGetThemedIcon,
  useTheme,
  View,
  withStaticProperties,
} from 'tamagui'

// tamagui's switch already sizes the track and thumb from the size ladder;
// bento adds an icon that sits in the half of the track the thumb leaves free

const THUMB_INSET = 2

const SwitchIconFrame = styled(View, {
  position: 'absolute',
  top: THUMB_INSET,
  bottom: THUMB_INSET,
  justify: 'center',
  items: 'center',
  variants: {
    placement: {
      left: { left: THUMB_INSET },
      right: { right: THUMB_INSET },
    },
  } as const,
  defaultVariants: {
    placement: 'right',
  },
})

export const SwitchIcon = createStyledHOC(
  SwitchIconFrame,
  (
    props: React.PropsWithChildren<{
      scaleIcon?: number
      color?: ColorTokens | string
    }>,
    ref
  ) => {
    const { children, color: colorProp, scaleIcon = 1, ...rest } = props
    const { size } = SwitchStyledContext.useStyledContext()
    const sizing = resolveSizing(size as ComponentSize | undefined)
    const side = sizing.square - THUMB_INSET * 2

    const theme = useTheme()
    const color = getVariable(colorProp || theme['color-9']?.get('web'))

    const getThemedIcon = useGetThemedIcon({
      size: Math.round(side * 0.6 * scaleIcon),
      color: color as any,
    })
    return (
      <SwitchIconFrame ref={ref} width={side} {...rest}>
        {getThemedIcon(children)}
      </SwitchIconFrame>
    )
  }
)

export const Switch = withStaticProperties(TamaguiSwitch, {
  Thumb: TamaguiSwitch.Thumb,
  Icon: SwitchIcon,
})

export type { SwitchProps }
