export const webToNativeProps = {
  objectFit: (val: any) => {
    const data = {
      contain: 'contain',
      cover: 'cover',
      fill: 'stretch',
      none: 'center',
      scaleDown: 'contain',
    }
    return ['resizeMode', data[val] || 'center']
  },
  verticalAlign: (val: any) => {
    const data = {
      top: 'top',
      middle: 'center',
      bottom: 'bottom',
      auto: 'auto',
    }
    return ['textAlignVertical', data[val] || 'auto']
  },
  inset: (val: any) => ({
    top: val,
    right: val,
    bottom: val,
    left: val,
  }),
} as any
