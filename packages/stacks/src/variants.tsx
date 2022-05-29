import { ScaleVariantExtras, SizeTokens, buttonScaling, getSizeScaledToFont } from '@tamagui/core'

import { getElevation } from './Stacks'

export function getCircleSize(size: SizeTokens, extras: ScaleVariantExtras) {
  const sizeVal = size ?? '$4'
  const scale = getSizeScaledToFont(sizeVal, buttonScaling, extras)
  return scale.minHeight
}

export const elevate = {
  true: (_, extras) => {
    return getElevation(extras.props['size'], extras)
  },
}

export const bordered = (val: boolean | number, { props }) => {
  return {
    // TODO size it with size in '...size'
    borderWidth: typeof val === 'number' ? val : 1,
    borderColor: '$borderColor',

    ...(props.hoverable && {
      hoverStyle: {
        borderColor: '$borderColorHover',
      },
    }),

    ...(props.pressable && {
      pressStyle: {
        borderColor: '$borderColorPress',
      },
    }),

    ...(props.focusable && {
      focusStyle: {
        borderColor: '$borderColorFocus',
      },
    }),
  }
}

export const padded = {
  true: (_, extras) => {
    const { tokens, props } = extras
    return {
      padding: tokens.size[props.size] || tokens.size['$4'],
    }
  },
}

export const radiused = {
  true: (_, extras) => {
    const { tokens, props } = extras
    return {
      borderRadius: tokens.radius[props.size] || tokens.radius['$4'],
    }
  },
}

export const circular = {
  true: (_, extras) => {
    const { props } = extras
    const size = getCircleSize(props.size, extras)
    return {
      width: size,
      height: size,
      maxWidth: size,
      maxHeight: size,
      minWidth: size,
      minHeight: size,
      borderRadius: 100_000,
      paddingVertical: 0,
      paddingHorizontal: 0,
    }
  },
}

export const hoverable = {
  true: {
    hoverStyle: {
      backgroundColor: '$backgroundHover',
      borderColor: '$borderColorHover',
    },
  },
  false: {
    hoverStyle: {
      backgroundColor: '$background',
      borderColor: '$borderColor',
    },
  },
}

export const pressable = {
  true: {
    pressStyle: {
      backgroundColor: '$backgroundPress',
      borderColor: '$borderColorPress',
    },
  },
  false: {
    pressStyle: {
      backgroundColor: '$background',
      borderColor: '$borderColor',
    },
  },
}

export const focusable = {
  true: {
    focusStyle: {
      backgroundColor: '$backgroundFocus',
      borderColor: '$borderColorFocus',
    },
  },
  false: {
    focusStyle: {
      backgroundColor: '$background',
      borderColor: '$borderColor',
    },
  },
}
