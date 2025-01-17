const resizeModeMap = {
  fill: 'stretch',
  none: 'center',
  'scale-down': 'contain',
  contain: 'contain',
  cover: 'cover',
}

const verticalAlignMap = {
  top: 'top',
  middle: 'center',
  bottom: 'bottom',
  auto: 'auto',
}

export const webToNativeDynamicExpansion = {
  objectFit: (val: any) => {
    let resizeMode = resizeModeMap[val] || 'cover'
    return [['resizeMode', resizeMode]]
  },
  verticalAlign: (val: any) => {
    return [['textAlignVertical', verticalAlignMap[val] || 'auto']]
  },
} as any

const vert = ['Top', 'Bottom']
const es = ['End', 'Start']
const t = ['Top']
const b = ['Bottom']
const s = ['Start']
const e = ['End']
const h = ['Height']
const w = ['Width']

const expansionsNoPrefix: Record<string, string[]> = {
  borderBlockColor: ['TopColor', 'BottomColor'],
  borderInlineColor: ['EndColor', 'StartColor'],
  borderBlockWidth: ['TopWidth', 'BottomWidth'],
  borderInlineWidth: ['EndWidth', 'StartWidth'],
  borderBlockStyle: ['TopStyle', 'BottomStyle'],
  borderInlineStyle: ['EndStyle', 'StartStyle'],
  marginBlock: vert,
  marginInline: es,
  paddingBlock: vert,
  paddingInline: es,
  borderBlockStartColor: ['TopColor'],
  borderBlockEndColor: ['BottomColor'],
  borderInlineStartColor: ['StartColor'],
  borderInlineEndColor: ['EndColor'],
  borderBlockStartWidth: ['TopWidth'],
  borderBlockEndWidth: ['BottomWidth'],
  borderInlineStartWidth: ['StartWidth'],
  borderInlineEndWidth: ['EndWidth'],
  borderBlockStartStyle: ['TopStyle'],
  borderBlockEndStyle: ['BottomStyle'],
  borderInlineStartStyle: ['StartStyle'],
  borderInlineEndStyle: ['EndStyle'],
  marginBlockStart: t,
  marginBlockEnd: b,
  marginInlineStart: s,
  marginInlineEnd: e,
  paddingBlockStart: t,
  paddingBlockEnd: b,
  paddingInlineStart: s,
  paddingInlineEnd: e,
  minBlockSize: h,
  maxBlockSize: h,
  minInlineSize: w,
  maxInlineSize: w,
}

for (const parent in expansionsNoPrefix) {
  const prefix = parent.slice(0, /[A-Z]/.exec(parent)?.index ?? parent.length)
  expansionsNoPrefix[parent] = expansionsNoPrefix[parent].map((k) => `${prefix}${k}`)
}

const expansions: Record<string, string[]> = {
  inset: ['top', 'right', 'bottom', 'left'],
  insetBlock: ['top', 'bottom'],
  insetBlockStart: ['top'],
  insetBlockEnd: ['bottom'],
  insetInlineStart: ['left'],
  insetInlineEnd: ['right'],
  blockSize: ['height'],
  inlineSize: ['width'],
}

export const webToNativeExpansion = Object.assign(expansionsNoPrefix, expansions)
