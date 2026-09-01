import { resolveSizeToken } from '@tamagui/size'
import { styled, type SizeTokens } from '@tamagui/web'

export const getShapeSize = styled.dynamic<SizeTokens | number | true>(
  (size, { tokens }) => {
    const sizeToken = resolveSizeToken(size, 'size')
    // a numeric size is a literal pixel value, never a token index. the size
    // scale is keyed by numeric-looking strings ('60'), so indexing it with a
    // number silently turns <Square size={60} /> into that token's value.
    // resolveTokenSize in @tamagui/size draws the same line.
    const resolved =
      typeof sizeToken === 'number' ? sizeToken : (tokens.size[sizeToken] ?? sizeToken)
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
  }
)
