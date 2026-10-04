import { getFontSized } from '@tamagui/get-font-sized'
import type { ColorTokens, FontSizeTokens, SizeTokens } from 'tamagui'
import {
  createStyledHOC,
  createStyledContext,
  getFontSize,
  styled,
  Text,
  useGetThemedIcon,
  View,
  withStaticProperties,
} from 'tamagui'

const ChipContext = createStyledContext({
  size: '4' as SizeTokens,
})

const CHIP_NAME = 'ChipName'

const ChipImpl = styled(View, {
  name: CHIP_NAME,
  flexDirection: 'row',
  context: ChipContext,
  borderRadius: 5,
  paddingHorizontal: '3',
  backgroundColor: 'color-6 hover:color-6',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    circular: {
      true: {
        borderRadius: 1000_000_000,
      },
    },
    size: {
      Size: (val, { tokens }) => {
        return {
          paddingHorizontal: tokens.space[val].val,
          paddingVertical: tokens.space[val].val * 0.2,
        }
      },
    },
    pressable: {
      true: {
        tabIndex: 0,
        role: 'button',
        outlineColor: 'focus-visible:outline-color',
        outlineStyle: 'focus-visible:solid',
        outlineWidth: 'focus-visible:2px',
      },
    },
  } as const,
})

const CHIP_TEXT_NAME = 'ChipText'

const ChipText = styled(Text, {
  name: CHIP_TEXT_NAME,
  context: ChipContext,
  fontFamily: 'body',
  color: 'color',
  size: '4',
  variants: {
    size: {
      FontSize: getFontSized as any,
    },
  } as const,
})

type ChipIconProps = {
  color?: ColorTokens | string
  scaleIcon?: number
  size?: SizeTokens
  children: React.ReactNode
}

const CHIP_ICON = 'ChipIcon'

const ChipIconFrame = styled(View, {
  name: CHIP_ICON,
  context: ChipContext,
  variants: {
    size: {
      Size: (val, { tokens }) => {
        if (typeof val === 'number') {
          return {
            paddingHorizontal: val * 0.25,
            paddingVertical: val * 0.25,
          }
        }
        return {
          paddingHorizontal: tokens.space[val].val * 0.25,
          paddingVertical: tokens.space[val].val * 0.25,
        }
      },
    },
  },
})

const ChipIcon = createStyledHOC(ChipIconFrame, (props: ChipIconProps, ref) => {
  const { children, scaleIcon = 0.7, size, color, ...rest } = props
  const chipContext = ChipContext.useStyledContext()
  const finalSize = size || chipContext.size

  const iconSize =
    (typeof finalSize === 'number'
      ? finalSize * 0.5
      : getFontSize(finalSize as FontSizeTokens)) * scaleIcon

  const getThemedIcon = useGetThemedIcon({
    size: iconSize,
    color: color as any,
  })
  return (
    <ChipIconFrame ref={ref} {...rest}>
      {getThemedIcon(children)}
    </ChipIconFrame>
  )
})

const CHIP_BUTTON = 'Button'

const ButtonComp = styled(View, {
  name: CHIP_BUTTON,
  context: ChipContext,
  tabIndex: 0,
  role: 'button',
  borderRadius: 1000_000_000,
  backgroundColor:
    'background hover:background-hover press:background-press focus:background-focus',
  justifyContent: 'center',
  alignItems: 'center',
  variants: {
    size: {} as any,
    alignRight: {
      boolean: (val, { props, tokens }) => {
        if (val) {
          const size = (
            (props as any).size === true ? '4' : (props as any).size
          ) as Exclude<SizeTokens, true>
          if (typeof size === 'number') {
            return {
              x: size * 0.55,
            }
          }
          return {
            x: tokens.space[size].val * 0.55,
          }
        }
      },
    },
    alignLeft: {
      boolean: (val, { props, tokens }) => {
        if (val) {
          const size = (
            (props as any).size === true ? '4' : (props as any).size
          ) as Exclude<SizeTokens, true>
          if (typeof size === 'number') {
            return {
              x: size * -0.55,
            }
          }
          return {
            x: tokens.space[size].val * -0.55,
          }
        }
      },
    },
  } as const,
})

export const Chip = withStaticProperties(ChipImpl, {
  Text: ChipText,
  Icon: ChipIcon,
  Button: ButtonComp,
})
