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
  }
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
