import type { ComponentSize } from '@tamagui/core'
import type { ColorTokens, FontSizeTokens, SizeTokens } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import {
  createStyledHOC,
  getFontSize,
  getVariable,
  getVariableValue,
  styled,
  Switch as TamaguiSwitch,
  SwitchStyledContext,
  useGetThemedIcon,
  useTheme,
  View,
  withStaticProperties,
  type SwitchProps,
} from 'tamagui'

// mirror exactly what the wrapped tamagui components accept (style shorthands,
// longhands, pseudo styles) instead of the narrower exported SwitchProps
type FrameProps = React.ComponentProps<typeof TamaguiSwitch>
type ThumbProps = React.ComponentProps<typeof TamaguiSwitch.Thumb>

// v3 ships Switch unstyled - this is bento's skin over it. It stays a plain
// wrapper rather than styled(): a styled() layer over a component that owns a
// styled context reads that context and re-emits its values as props, which
// would re-provide the *outer* (empty) SwitchStyledContext over the real one
// and leave the thumb without `active`/`size`.
const getSwitchHeight = (val: SizeTokens | number | true) =>
  Math.round(getVariableValue(getSize(val)) * 0.65)

const getSwitchWidth = (val: SizeTokens | number | true) => getSwitchHeight(val) * 2

export function SwitchThumb(props: ThumbProps) {
  const { size: sizeContext } = SwitchStyledContext.useStyledContext()
  const size = props.size ?? sizeContext ?? true
  const thumbSize = getSwitchHeight(size)
  return (
    <TamaguiSwitch.Thumb
      transition="quick"
      height={thumbSize}
      width={thumbSize}
      backgroundColor="#fff"
      borderRadius={1000}
      boxShadow="0 1px 2px rgba(0, 0, 0, 0.15)"
      elevationAndroid={2}
      justify="center"
      items="center"
      {...props}
    />
  )
}

const SwitchIconFrame = styled(View, {
  position: 'absolute',
  context: SwitchStyledContext,
  height: '100%',
  justify: 'center',
  items: 'center',
  variants: {
    placement: {
      right: (_, { props, tokens }) => {
        const amount = tokens.space[(props as any).size as any].val * 0.35
        return {
          right: amount,
        }
      },
      left: (_, { props, tokens }) => {
        const amount = tokens.space[(props as any).size as any].val * 0.35
        return {
          left: amount,
        }
      },
    },
    size: {
      Size: {} as any,
    },
  } as const,
  defaultVariants: {
    placement: 'right',
  },
})

const getIconSize = (size: ComponentSize, scale: number) => {
  return (
    (typeof size === 'number' ? size * 0.5 : getFontSize(size)) * scale
  )
}

export const SwitchIcon = createStyledHOC(
  SwitchIconFrame,
  (
    props: React.PropsWithChildren<{
      scaleIcon?: number
      color?: ColorTokens | string
    }>,
    ref
  ) => {
    const { children, color: colorProp, scaleIcon = 1.2, ...rest } = props
    const { size } = SwitchStyledContext.useStyledContext()

    const theme = useTheme()
    const color = getVariable(
      colorProp || theme[colorProp as any]?.get('web') || theme['color-9']?.get('web')
    )
    const iconSize = getIconSize(size, scaleIcon)

    const getThemedIcon = useGetThemedIcon({
      size: iconSize,
      color: color as any,
    })
    return (
      <SwitchIconFrame ref={ref} {...rest}>
        {getThemedIcon(children)}
      </SwitchIconFrame>
    )
  }
)

function SwitchFrame(props: FrameProps) {
  const size = props.size ?? true
  const height = getSwitchHeight(size) + 4
  return (
    <TamaguiSwitch
      position="relative"
      borderRadius={1000}
      backgroundColor="background"
      borderWidth={2}
      borderColor="background"
      height={height}
      minHeight={height}
      width={getSwitchWidth(size) + 4}
      outlineColor="focus:outline-color"
      outlineStyle="focus:solid"
      outlineWidth="focus:2px"
      activeStyle={{ backgroundColor: 'background-press' }}
      {...props}
    />
  )
}

export const Switch = withStaticProperties(SwitchFrame, {
  Thumb: SwitchThumb,
  Icon: SwitchIcon,
})

export type { SwitchProps }
