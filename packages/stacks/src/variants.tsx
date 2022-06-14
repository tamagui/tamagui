import { getElevation } from './Stacks'

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
      padding: tokens.space[props.size] || tokens.space['$4'],
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
  true: (_, { props, tokens }) => {
    const size = tokens.size[props.size]
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
