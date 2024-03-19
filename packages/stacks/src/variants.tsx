import { getElevation } from './getElevation'

export const elevate = {
  true: (_: boolean, extras: any) => {
    return getElevation(extras.props['size'], extras) as any
  },
}

export const bordered = (val: boolean | number, { props }) => {
  return {
    // TODO size it with size in '...size'
    borderWidth: typeof val === 'number' ? val : 1,
    borderColor: '$borderColor',

    ...(props.hoverTheme && {
      hoverStyle: {
        borderColor: '$borderColorHover',
      },
    }),

    ...(props.pressTheme && {
      pressStyle: {
        borderColor: '$borderColorPress',
      },
    }),

    ...(props.focusTheme && {
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
      padding: tokens.space[props.size] || tokens.space['$true'],
    }
  },
}

export const radiused = {
  true: (_, extras) => {
    const { tokens, props } = extras
    return {
      borderRadius: tokens.radius[props.size] || tokens.radius['$true'],
    }
  },
}

const circularStyle = {
  borderRadius: 100_000,
  padding: 0,
}

export const circular = {
  true: (_, { props, tokens }) => {
    if (!('size' in props)) {
      return circularStyle
    }
    const size = typeof props.size === 'number' ? props.size : tokens.size[props.size]
    return {
      ...circularStyle,
      width: size,
      height: size,
      maxWidth: size,
      maxHeight: size,
      minWidth: size,
      minHeight: size,
    }
  },
}

export const hoverTheme = {
  true: {
    hoverStyle: {
      backgroundColor: '$backgroundHover',
      borderColor: '$borderColorHover',
    },
  },
  false: {},
}

export const pressTheme = {
  true: {
    cursor: 'pointer',
    pressStyle: {
      backgroundColor: '$backgroundPress',
      borderColor: '$borderColorPress',
    },
  },
  false: {},
}

export const focusTheme = {
  true: {
    focusStyle: {
      backgroundColor: '$backgroundFocus',
      borderColor: '$borderColorFocus',
    },
  },
  false: {},
}
