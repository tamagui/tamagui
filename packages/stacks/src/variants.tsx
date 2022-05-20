import { getCircleSize } from './SizableStack'
import { getElevation } from './Stacks'

export const elevate = {
  true: (_, extras) => {
    return getElevation(extras.props['size'], extras)
  },
}

export const circular = {
  true: (_, extras) => {
    const { props } = extras
    // @ts-ignore
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
}
