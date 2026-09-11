import { resolveSize } from '@tamagui/size'
import { styled, type SizeTokens } from '@tamagui/web'

export const getShapeSize = styled.dynamic<SizeTokens | number | true>((size, env) => {
  // a number is pixels. a token key is the size scale (v6: `4` is 16px). a
  // named size or `true` is that size's control height, so a Square "md" is
  // as tall as a Button "md".
  const key = typeof size === 'string' ? size.replace(/^\$/, '') : size
  const resolved =
    typeof key === 'number'
      ? key
      : (env.tokens.size[key as any] ?? resolveSize(size, env).controlHeight)
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
