// import { View, SwitchStyledContext, createSwitch, styled } from 'tamagui'

// const Frame = styled(View, {
//   context: SwitchStyledContext,
//   borderRadius: 20,
//   variants: {
//     checked: {
//       true: {
//         backgroundColor: '$green10',
//       },
//       false: {
//         backgroundColor: '$red10',
//       },
//     },
//     size: {
//       '...size': (size, { tokens }) => {
//         return {
//           width: tokens.size[size],
//           height: tokens.size[size].val / 2,
//         }
//       },
//     },
//   } as const,

//   defaultVariants: {
//     checked: false,
//     size: '$true',
//   },
// })
// const Thumb = styled(View, {
//   context: SwitchStyledContext,
//   borderRadius: 20,
//   backgroundColor: '#fff',
//   variants: {
//     checked: {
//       true: {},
//       false: {},
//     },
//     size: {
//       '...size': (size, { tokens }) => {
//         return {
//           width: tokens.size[size].val / 2,
//           height: tokens.size[size].val / 2,
//         }
//       },
//     },
//   } as const,
// })

// export const Switch = createSwitch({
//   Frame,
//   //@ts-ignore
//   Thumb,
// })

// tamagui one

import type { ColorTokens, FontSizeTokens, SizeTokens } from '@tamagui/core'
import { getSize } from '@tamagui/get-token'
import {
  createSwitch,
  View,
  getVariableValue,
  styled,
  getFontSize,
  useTheme,
  getVariable,
  useGetThemedIcon,
  withStaticProperties,
  SwitchStyledContext,
} from 'tamagui'

export const SwitchThumb = styled(View, {
  name: 'SwitchThumb',
  animation: 'quick',

  variants: {
    unstyled: {
      false: {
        size: '$true',
        backgroundColor: '$gray12Dark',
        borderRadius: 1000,
      },
    },

    checked: {
      true: {},
    },

    size: {
      '...size': (val) => {
        const size = getSwitchHeight(val)
        return {
          height: size,
          width: size,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

const getSwitchHeight = (val: SizeTokens) =>
  Math.round(getVariableValue(getSize(val)) * 0.65)

const getSwitchWidth = (val: SizeTokens) => getSwitchHeight(val) * 2

export const SwitchFrame = styled(View, {
  name: 'Switch',
  tag: 'button',

  variants: {
    unstyled: {
      false: {
        borderRadius: 1000,
        backgroundColor: '$background',
        borderWidth: 2,
        borderColor: '$background',

        focusStyle: {
          outlineColor: '$outlineColor',
          outlineStyle: 'solid',
          outlineWidth: 2,
        },
      },
    },

    checked: {
      true: {
        backgroundColor: '$green10',
      },
      false: {
        backgroundColor: '$red10',
      },
    },

    size: {
      '...size': (val) => {
        const height = getSwitchHeight(val) + 4
        const width = getSwitchWidth(val) + 4
        return {
          height,
          minHeight: height,
          width,
        }
      },
    },
  } as const,

  defaultVariants: {
    unstyled: process.env.TAMAGUI_HEADLESS === '1' ? true : false,
  },
})

const SwitchIconFrame = styled(View, {
  position: 'absolute',
  context: SwitchStyledContext,
  height: '100%',
  justifyContent: 'center',
  alignItems: 'center',
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
      '...size': {} as any,
    },
  } as const,
  defaultVariants: {
    placement: 'right',
  },
})

const getIconSize = (size: FontSizeTokens, scale: number) => {
  return (
    (typeof size === 'number' ? size * 0.5 : getFontSize(size as FontSizeTokens)) * scale
  )
}
export const SwitchIcon = SwitchIconFrame.styleable<{
  scaleIcon?: number
  color?: ColorTokens | string
}>((props, ref) => {
  const { children, color: colorProp, scaleIcon = 1.2, ...rest } = props
  const { size } = SwitchStyledContext.useStyledContext()

  const theme = useTheme()
  const color = getVariable(
    colorProp || theme[colorProp as any]?.get('web') || theme.color10?.get('web')
  )
  const iconSize = getIconSize(size as FontSizeTokens, scaleIcon)

  const getThemedIcon = useGetThemedIcon({ size: iconSize, color: color as any })
  return (
    <SwitchIconFrame ref={ref} {...rest}>
      {getThemedIcon(children)}
    </SwitchIconFrame>
  )
})

const SwitchComp = createSwitch({
  Frame: SwitchFrame,
  Thumb: SwitchThumb,
})

export const Switch = withStaticProperties(SwitchComp, {
  Icon: SwitchIcon,
})
