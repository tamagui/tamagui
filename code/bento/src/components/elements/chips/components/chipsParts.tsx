import { getFontSized } from '@tamagui/get-font-sized'
import type { ColorTokens, FontSizeTokens, SizeTokens } from 'tamagui'
import {
  createStyledContext,
  getFontSize,
  styled,
  Text,
  useGetThemedIcon,
  View,
  withStaticProperties,
} from 'tamagui'

const ChipContext = createStyledContext({
  size: '$true' as SizeTokens,
})

const CHIP_NAME = 'ChipName'

const ChipImpl = styled(View, {
  name: CHIP_NAME,
  flexDirection: 'row',
  context: ChipContext,
  variants: {
    rounded: {
      true: {
        borderRadius: 1000_000_000,
      },
    },
    unstyled: {
      false: {
        borderRadius: 5,
        paddingHorizontal: '$3',
        backgroundColor: '$color6',
        justifyContent: 'center',
        alignItems: 'center',
        hoverStyle: {
          backgroundColor: '$color7',
        },
      },
    },
    size: {
      '...size': (val, allTokens) => {
        const { tokens } = allTokens
        return {
          paddingHorizontal: tokens.space[val],
          paddingVertical: tokens.space[val].val * 0.2,
        }
      },
    },
    pressable: {
      true: {
        focusable: true,
        role: 'button',
        focusVisibleStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

const CHIP_TEXT_NAME = 'ChipText'

const ChipText = styled(Text, {
  name: CHIP_TEXT_NAME,
  context: ChipContext,
  variants: {
    unstyled: {
      false: {
        fontFamily: '$body',
        size: '$true',
        color: '$color',
      },
    },
    size: {
      '...fontSize': getFontSized,
    },
  } as const,
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
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
      '...size': (val, { tokens }) => {
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

const ChipIcon = ChipIconFrame.styleable<ChipIconProps>((props, ref) => {
  const { children, scaleIcon = 0.7, size, color, ...rest } = props
  const chipContext = ChipContext.useStyledContext()
  const finalSize = size || chipContext.size

  const iconSize =
    (typeof finalSize === 'number'
      ? finalSize * 0.5
      : getFontSize(finalSize as FontSizeTokens)) * scaleIcon

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
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
  focusable: true,
  role: 'button',
  variants: {
    size: {} as any,
    unstyled: {
      false: {
        borderRadius: 1000_000_000,
        backgroundColor: '$background',
        justifyContent: 'center',
        alignItems: 'center',
        hoverStyle: {
          backgroundColor: '$backgroundHover',
        },
        pressStyle: {
          backgroundColor: '$backgroundPress',
        },
        focusStyle: {
          backgroundColor: '$backgroundFocus',
        },
      },
    },
    alignRight: {
      ':boolean': (val, { props, tokens }) => {
        if (val) {
          const size = (props as any).size as SizeTokens
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
      ':boolean': (val, { props, tokens }) => {
        if (val) {
          const size = (props as any).size as SizeTokens
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
  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

export const Chip = withStaticProperties(ChipImpl, {
  Text: ChipText,
  Icon: ChipIcon,
  Button: ButtonComp,
})
