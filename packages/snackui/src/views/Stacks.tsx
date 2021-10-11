import { createComponent } from '../createComponent'
import { isWeb } from '../platform'
import { ShorthandViewStyleProps, StackProps } from '../StackProps'

export const defaults = {
  ...(isWeb && {
    alignItems: 'stretch',
    flexShrink: 0,
    display: 'flex',
    flexBasis: 'auto',
    boxSizing: 'border-box',
  }),
}

export const HStack = createComponent<StackProps>({
  propMapper: shorthandPropMapper,
  defaultProps: {
    ...defaults,
    flexDirection: 'row',
  },
})

export const VStack = createComponent<StackProps>({
  propMapper: shorthandPropMapper,
  defaultProps: {
    ...defaults,
    flexDirection: 'column',
  },
})

export const AbsoluteVStack = createComponent<StackProps>({
  propMapper: shorthandPropMapper,
  defaultProps: {
    ...defaults,
    flexDirection: 'column',
    position: 'absolute',
  },
})

export const AbsoluteHStack = createComponent<StackProps>({
  propMapper: shorthandPropMapper,
  defaultProps: {
    ...defaults,
    flexDirection: 'row',
    position: 'absolute',
  },
})

function shorthandPropMapper(key: string, value: any) {
  if (shorthandKeyMap[key]) {
    return [[shorthandKeyMap[key] || key, value]] as any
  }
  return true
}

const shorthandKeyMap: { [key in keyof ShorthandViewStyleProps]: string } = {
  p: 'padding',
  pt: 'paddingTop',
  pb: 'paddingBottom',
  pl: 'paddingLeft',
  pr: 'paddingRight',
  px: 'paddingHorizontal',
  py: 'paddingVertical',
  m: 'margin',
  mt: 'marginTop',
  mb: 'marginBottom',
  ml: 'marginLeft',
  mr: 'marginRight',
  mx: 'marginHorizontal',
  my: 'marginVertical',
  f: 'flex',
  fd: 'flexDirection',
  fw: 'flexWrap',
  fg: 'flexGrow',
  fs: 'flexShrink',
  fb: 'flexBasis',
  ai: 'alignItems',
  ac: 'alignContent',
  jc: 'justifyContent',
  as: 'alignSelf',
  bc: 'backgroundColor',
  br: 'borderRadius',
  btrr: 'borderTopRightRadius',
  bbrr: 'borderBottomRightRadius',
  bblr: 'borderBottomLeftRadius',
  btlr: 'borderTopLeftRadius',
  pe: 'pointerEvents',
}
