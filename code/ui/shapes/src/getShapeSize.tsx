import { styled, type SizeTokens } from '@tamagui/web'

export const getShapeSize = styled.dynamic<SizeTokens | number>((size, env) => {
  // a number is px, a string is a size token key (v6: `4` is 16px).
  // without a size the shape fits its content, like any stack.
  const key = typeof size === 'string' ? size.replace(/^\$/, '') : size
  const resolved = typeof key === 'number' ? key : env.tokens.size[key as any]
  if (resolved == null) return
  const width = resolved
  const height = resolved
  return {
    width,
    height,
    minWidth: width,
    maxWidth: width,
    maxHeight: height,
    minHeight: height,
  }
})
