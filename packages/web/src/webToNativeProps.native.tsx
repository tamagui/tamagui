export const webToNativeProps = {
  borderBlockColor: (val: any) => ({ borderTopColor: val, borderBottomColor: val }),
  borderBlockStartColor: 'borderTopColor',
  borderBlockEndColor: 'borderBottomColor',
  borderInlineColor: (val: any) => ({
    borderEndColor: val,
    borderStartColor: val,
  }),
  borderInlineStartColor: 'borderStartColor',
  borderInlineEndColor: 'borderEndColor',
  borderBlockWidth: (val: any) => ({
    borderTopWidth: val,
    borderBottomWidth: val,
  }),
  borderBlockStartWidth: 'borderTopWidth',
  borderBlockEndWidth: 'borderBottomWidth',
  borderInlineWidth: (val: any) => ({
    borderEndWidth: val,
    borderStartWidth: val,
  }),
  borderInlineStartWidth: 'borderStartWidth',
  borderInlineEndWidth: 'borderEndWidth',
  marginBlock: (val: any) => ({
    marginTop: val,
    marginBottom: val,
  }),
  marginBlockStart: 'marginTop',
  marginBlockEnd: 'marginBottom',
  marginInline: (val: any) => ({
    marginEnd: val,
    marginStart: val,
  }),
  marginInlineStart: 'marginStart',
  marginInlineEnd: 'marginEnd',
  paddingBlock: (val: any) => ({
    paddingTop: val,
    paddingBottom: val,
  }),
  paddingBlockStart: 'paddingTop',
  paddingBlockEnd: 'paddingBottom',
  paddingInline: (val: any) => ({
    paddingEnd: val,
    paddingStart: val,
  }),
  paddingInlineStart: 'paddingStart',
  paddingInlineEnd: 'paddingEnd',
  objectFit: (val: any) => {
    const data = {
      contain: 'contain',
      cover: 'cover',
      fill: 'stretch',
      none: 'center',
      scaleDown: 'contain',
    }
    return { resizeMode: data[val] || 'center' }
  },
  verticalAlign: (val: any) => {
    const data = {
      top: 'top',
      middle: 'center',
      bottom: 'bottom',
      auto: 'auto',
    }
    return { textAlignVertical: data[val] || 'auto' }
  },
  inset: (val: any) => ({
    top: val,
    right: val,
    bottom: val,
    left: val,
  }),
  insetBlock: (val: any) => ({
    top: val,
    bottom: val,
  }),
  insetBlockStart: 'top',
  insetBlockEnd: 'bottom',
  insetInline: (val: any) => ({
    left: val,
    right: val,
  }),
  insetInlineStart: 'left',
  insetInlineEnd: 'right',
  blockSize: 'height',
  minBlockSize: 'minHeight',
  maxBlockSize: 'maxHeight',
  inlineSize: 'width',
  minInlineSize: 'minWidth',
  maxInlineSize: 'maxWidth',
} as any
